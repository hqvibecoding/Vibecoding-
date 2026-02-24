import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Upload, Loader2, CheckCircle2, Trash2, Edit3, ChevronLeft } from "lucide-react";
import { uploadToCloudinary, deleteFromCloudinary } from "../cloudinary";
import { db } from "../firebase";
import { ref, push, set, remove, update, onValue } from "firebase/database";
import { ArchiveItem } from "../types";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  items: ArchiveItem[];
}

export default function AdminPanel({ isOpen, onClose, items }: AdminPanelProps) {
  const [view, setView] = useState<"add" | "manage" | "profile">("manage");
  const [editingItem, setEditingItem] = useState<ArchiveItem | null>(null);
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [model, setModel] = useState<File | null>(null);
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [currentProfilePic, setCurrentProfilePic] = useState<{url: string, publicId: string} | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    if (editingItem) {
      setTitle(editingItem.title);
      setView("add");
    } else {
      setTitle("");
      setThumbnail(null);
      setModel(null);
    }
  }, [editingItem]);

  useEffect(() => {
    const profileRef = ref(db, "settings/profilePic");
    return onValue(profileRef, (snapshot) => {
      setCurrentProfilePic(snapshot.val());
    });
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    if (!editingItem && (!thumbnail || !model)) return;

    // 1. Strict File Size Validation (Pre-upload)
    if (model && model.size > 10485760) {
      alert("Limit Exceeded: 3D models must be under 10MB to ensure high-speed loading and prevent crashes on mobile devices.");
      return;
    }

    setIsUploading(true);
    setStatus("idle");

    try {
      let thumbnailUrl = editingItem?.thumbnailUrl || "";
      let thumbnailPublicId = editingItem?.thumbnailPublicId || "";
      let modelUrl = editingItem?.modelUrl || "";
      let modelPublicId = editingItem?.modelPublicId || "";

      // Parallelize uploads if new files are selected
      const uploadPromises = [];
      if (thumbnail) uploadPromises.push(uploadToCloudinary(thumbnail));
      else uploadPromises.push(Promise.resolve(null));

      if (model) uploadPromises.push(uploadToCloudinary(model));
      else uploadPromises.push(Promise.resolve(null));

      const [thumbRes, modelRes] = await Promise.all(uploadPromises);

      if (thumbRes) {
        // If editing, delete old thumbnail from Cloudinary
        if (editingItem?.thumbnailPublicId) {
          await deleteFromCloudinary(editingItem.thumbnailPublicId);
        }
        // 2. Cloudinary Optimization (High Quality)
        // Inject /q_auto:best,f_auto/ into the returned secure_url
        thumbnailUrl = thumbRes.url.replace("/upload/", "/upload/q_auto:best,f_auto/");
        thumbnailPublicId = thumbRes.publicId;
      }

      if (modelRes) {
        // If editing, delete old model from Cloudinary
        if (editingItem?.modelPublicId) {
          await deleteFromCloudinary(editingItem.modelPublicId);
        }
        modelUrl = modelRes.url;
        modelPublicId = modelRes.publicId;
      }

      if (editingItem) {
        const itemRef = ref(db, `archive/${editingItem.id}`);
        await update(itemRef, {
          title,
          thumbnailUrl,
          thumbnailPublicId,
          modelUrl,
          modelPublicId,
        });
      } else {
        const itemsRef = ref(db, "archive");
        const newItemRef = push(itemsRef);
        await set(newItemRef, {
          id: newItemRef.key,
          title,
          thumbnailUrl,
          thumbnailPublicId,
          modelUrl,
          modelPublicId,
          createdAt: Date.now(),
        });
      }

      setStatus("success");
      setEditingItem(null);
      setTitle("");
      setThumbnail(null);
      setModel(null);
      
      setTimeout(() => {
        setStatus("idle");
        setView("manage");
      }, 1500);
    } catch (error) {
      console.error(error);
      setStatus("error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profilePicFile) return;

    setIsUploading(true);
    setStatus("idle");

    try {
      // Delete old profile pic from Cloudinary if it exists
      if (currentProfilePic?.publicId) {
        await deleteFromCloudinary(currentProfilePic.publicId);
      }

      const res = await uploadToCloudinary(profilePicFile);
      if (res) {
        const profileRef = ref(db, "settings/profilePic");
        await set(profileRef, {
          url: res.url,
          publicId: res.publicId
        });
        setStatus("success");
        setProfilePicFile(null);
        setTimeout(() => {
          setStatus("idle");
          setView("manage");
        }, 1500);
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteProfilePic = async () => {
    try {
      // Delete from Cloudinary
      if (currentProfilePic?.publicId) {
        await deleteFromCloudinary(currentProfilePic.publicId);
      }

      const profileRef = ref(db, "settings/profilePic");
      await remove(profileRef);
      setCurrentProfilePic(null);
      setStatus("success");
      setTimeout(() => setStatus("idle"), 1500);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (item: ArchiveItem) => {
    setIsUploading(true);
    setStatus("idle");
    try {
      // Delete from Cloudinary
      if (item.thumbnailPublicId) await deleteFromCloudinary(item.thumbnailPublicId);
      if (item.modelPublicId) await deleteFromCloudinary(item.modelPublicId);

      // Delete from Firebase
      const itemRef = ref(db, `archive/${item.id}`);
      await remove(itemRef);
      setDeleteConfirmId(null);
      setStatus("success");
      setTimeout(() => setStatus("idle"), 1500);
    } catch (error) {
      console.error("Delete failed:", error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("vault_auth");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/95 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl my-auto overflow-hidden flex flex-col h-full md:h-auto max-h-[100vh] md:max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between bg-zinc-950/50 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-3 md:gap-4">
                {(view === "add" || view === "profile") && (
                  <button 
                    onClick={() => { setView("manage"); setEditingItem(null); setProfilePicFile(null); }}
                    className="p-2 hover:bg-white/5 rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}
                <div>
                  <h2 className="premium-serif text-xl md:text-2xl font-light">
                    {view === "manage" ? "Manage Archive" : view === "profile" ? "Profile Settings" : editingItem ? "Edit Asset" : "Archive New Asset"}
                  </h2>
                  <p className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] opacity-40">
                    {status === "error" ? (
                      <span className="text-red-500 animate-pulse">Error: Check Secrets & Firebase Rules</span>
                    ) : status === "success" ? (
                      <span className="text-emerald-500">Operation Successful</span>
                    ) : (
                      view === "manage" ? `${items.length} Assets in Vault` : "Fill in the details below"
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-4">
                {view === "manage" && (
                  <>
                    <button 
                      onClick={handleLogout}
                      className="px-4 py-2 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-red-500/10 transition-colors"
                    >
                      Logout
                    </button>
                    <button 
                      onClick={() => setView("profile")}
                      className="px-6 py-2 border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-white/5 transition-colors"
                    >
                      Profile
                    </button>
                    <button 
                      onClick={() => setView("add")}
                      className="px-4 md:px-6 py-2 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-zinc-200 transition-colors"
                    >
                      Add New
                    </button>
                  </>
                )}
                <button onClick={onClose} className="p-2 opacity-40 hover:opacity-100 transition-opacity">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              {view === "manage" ? (
                <div className="grid grid-cols-1 gap-4">
                  {items.length === 0 ? (
                    <div className="py-20 text-center opacity-20 uppercase tracking-[0.5em] text-xs">
                      The vault is empty
                    </div>
                  ) : (
                    items.map((item) => (
                      <div 
                        key={item.id}
                        className="group flex items-center justify-between p-4 bg-zinc-900/50 border border-white/5 rounded-2xl hover:border-white/20 transition-all"
                      >
                        <div className="flex items-center gap-4 md:gap-6">
                          <img 
                            src={item.thumbnailUrl} 
                            alt={item.title} 
                            className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg border border-white/10"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <h3 className="premium-serif text-base md:text-lg font-light">{item.title}</h3>
                            <p className="text-[9px] md:text-[10px] uppercase tracking-widest opacity-40">Archive No. {item.id.slice(-4)}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {deleteConfirmId === item.id ? (
                            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
                              <span className="text-[10px] uppercase tracking-widest opacity-40 mr-2">Are you sure?</span>
                              <button 
                                onClick={() => handleDelete(item)}
                                className="px-4 py-2 bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-red-600 transition-colors"
                              >
                                Delete
                              </button>
                              <button 
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-4 py-2 bg-white/5 text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-white/10 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <>
                              <button 
                                onClick={() => setEditingItem(item)}
                                className="p-3 hover:bg-white/5 rounded-full transition-colors group/edit"
                              >
                                <Edit3 className="w-4 h-4 opacity-40 group-hover/edit:opacity-100 transition-opacity" />
                              </button>
                              <button 
                                onClick={() => setDeleteConfirmId(item.id)}
                                className="p-3 hover:bg-red-500/10 rounded-full transition-colors group/del"
                              >
                                <Trash2 className="w-4 h-4 opacity-40 group-hover/del:opacity-100 group-hover/del:text-red-500 transition-all" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : view === "profile" ? (
                <div className="max-w-md mx-auto py-10 space-y-10">
                  <form onSubmit={handleProfileUpdate} className="space-y-8">
                    <div className="space-y-4 text-center">
                      <label className="text-[10px] uppercase tracking-widest opacity-40 block">Profile Picture</label>
                      <label className="flex flex-col items-center justify-center w-32 h-32 mx-auto bg-zinc-900 border border-dashed border-white/10 rounded-full cursor-pointer hover:bg-zinc-800/50 transition-colors group overflow-hidden relative">
                        {profilePicFile ? (
                          <div className="text-center px-4">
                            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                          </div>
                        ) : currentProfilePic ? (
                          <img src={currentProfilePic.url} className="w-full h-full object-cover group-hover:opacity-40 transition-opacity" />
                        ) : (
                          <div className="text-center">
                            <Upload className="w-6 h-6 opacity-20 group-hover:opacity-40 transition-opacity mx-auto mb-2" />
                            <p className="text-[8px] uppercase tracking-widest opacity-40">Update DP</p>
                          </div>
                        )}
                        <input type="file" accept="image/*" onChange={(e) => setProfilePicFile(e.target.files?.[0] || null)} className="hidden" />
                      </label>
                      <p className="text-[10px] uppercase tracking-widest opacity-20">Recommended: Square image</p>
                    </div>

                    <button
                      type="submit"
                      disabled={isUploading || !profilePicFile}
                      className="w-full bg-white text-black py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
                    >
                      {isUploading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : status === "success" ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        "Update Profile Picture"
                      )}
                    </button>
                  </form>

                  {currentProfilePic && (
                    <div className="pt-6 border-t border-white/5">
                      <button
                        onClick={handleDeleteProfilePic}
                        className="w-full bg-red-500/10 text-red-500 py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-red-500/20 transition-all flex items-center justify-center gap-3"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Current Photo
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleUpload} className="space-y-8 max-w-2xl mx-auto">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest opacity-40 ml-1">Asset Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Obsidian Runner v1"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-zinc-900 border border-white/5 rounded-xl px-6 py-4 text-sm focus:outline-none focus:border-white/20 transition-colors"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest opacity-40 ml-1">
                        Thumbnail Image {editingItem && "(Optional)"}
                      </label>
                      <label className="flex flex-col items-center justify-center w-full aspect-video md:aspect-square bg-zinc-900 border border-dashed border-white/10 rounded-2xl cursor-pointer hover:bg-zinc-800/50 transition-colors group">
                        {thumbnail ? (
                          <div className="text-center px-4">
                            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                            <p className="text-[10px] uppercase tracking-widest truncate max-w-full">{thumbnail.name}</p>
                          </div>
                        ) : editingItem ? (
                          <div className="text-center px-4">
                            <img src={editingItem.thumbnailUrl} className="w-12 h-12 object-cover rounded-md mx-auto mb-2 opacity-40" referrerPolicy="no-referrer" />
                            <p className="text-[10px] uppercase tracking-widest opacity-40">Change Image</p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <Upload className="w-8 h-8 opacity-20 group-hover:opacity-40 transition-opacity mx-auto mb-3" />
                            <p className="text-[10px] uppercase tracking-widest opacity-40">Select Image</p>
                          </div>
                        )}
                        <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} className="hidden" />
                      </label>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest opacity-40 ml-1">
                        3D Model (.glb) {editingItem && "(Optional)"}
                      </label>
                      <label className="flex flex-col items-center justify-center w-full aspect-video md:aspect-square bg-zinc-900 border border-dashed border-white/10 rounded-2xl cursor-pointer hover:bg-zinc-800/50 transition-colors group">
                        {model ? (
                          <div className="text-center px-4">
                            <CheckCircle2 className={`w-8 h-8 mx-auto mb-2 ${model.size > 8388608 ? 'text-amber-500' : 'text-emerald-500'}`} />
                            <p className="text-[10px] uppercase tracking-widest truncate max-w-full">{model.name}</p>
                            {model.size > 8388608 && (
                              <p className="text-[8px] text-amber-500 mt-1">Warning: Large file ({Math.round(model.size / 1024 / 1024)}MB)</p>
                            )}
                          </div>
                        ) : editingItem ? (
                          <div className="text-center px-4">
                            <CheckCircle2 className="w-8 h-8 opacity-20 mx-auto mb-2" />
                            <p className="text-[10px] uppercase tracking-widest opacity-40">Change GLB</p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <Upload className="w-8 h-8 opacity-20 group-hover:opacity-40 transition-opacity mx-auto mb-3" />
                            <p className="text-[10px] uppercase tracking-widest opacity-40">Select GLB</p>
                            <p className="text-[8px] uppercase tracking-widest opacity-20 mt-1">Max 10MB for Speed</p>
                          </div>
                        )}
                        <input type="file" accept=".glb" onChange={(e) => setModel(e.target.files?.[0] || null)} className="hidden" />
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isUploading || (!editingItem && (!thumbnail || !model)) || !title}
                    className="w-full bg-white text-black py-5 rounded-xl text-sm font-bold uppercase tracking-[0.2em] hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing Asset...
                      </>
                    ) : status === "success" ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        {editingItem ? "Updated Successfully" : "Archived Successfully"}
                      </>
                    ) : status === "error" ? (
                      <>
                        <X className="w-5 h-5 text-red-500" />
                        Operation Failed
                      </>
                    ) : (
                      editingItem ? "Update Asset" : "Archive Asset"
                    )}
                  </button>
                  {status === "error" && (
                    <p className="text-red-500 text-[10px] uppercase tracking-widest text-center animate-pulse">
                      Check console for details or verify Cloudinary/Firebase config
                    </p>
                  )}
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

