
import React, { useState, useRef, useEffect } from 'react';
import { MOCK_POSTS } from '../constants';
import { IdentityTag, ForumPost } from '../types';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Plus, 
  Flag, 
  ShieldAlert, 
  X, 
  Image as ImageIcon, 
  Camera,
  Send, 
  CheckCircle, 
  MoreVertical, 
  Edit3, 
  Trash2,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';

interface Props {
  onShare: () => void;
  autoOpenModal?: boolean;
  onCloseModal?: () => void;
}

const CommunityPage: React.FC<Props> = ({ onShare, autoOpenModal, onCloseModal }) => {
  const [posts, setPosts] = useState<ForumPost[]>(MOCK_POSTS);
  const [isPosting, setIsPosting] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [selectedTag, setSelectedTag] = useState('就诊体验');
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const currentUserId = 'mock-123'; 

  const tags = ['就诊体验', '心理支持', '生活经验', '勋章展示', '科普讨论'];

  useEffect(() => {
    if (autoOpenModal) {
      setIsPosting(true);
      setEditingPostId(null);
      setPostTitle('');
      setPostContent('');
      setSelectedImages([]);
    }
  }, [autoOpenModal]);

  const handleClosePosting = () => {
    setIsPosting(false);
    if (onCloseModal) onCloseModal();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file: File) => URL.createObjectURL(file));
      setSelectedImages(prev => [...prev, ...newImages].slice(0, 9));
    }
  };

  const handlePostSubmit = () => {
    if (!postTitle || !postContent) return;

    if (editingPostId) {
      setPosts(prev => prev.map(p => 
        p.id === editingPostId 
          ? { ...p, title: postTitle, content: postContent, tags: [selectedTag], images: selectedImages }
          : p
      ));
      setEditingPostId(null);
    } else {
      const newPost: ForumPost = {
        id: Math.random().toString(36).substr(2, 9),
        userId: currentUserId,
        username: '莘花',
        userType: IdentityTag.PATIENT,
        title: postTitle,
        content: postContent,
        tags: [selectedTag],
        likes: 0,
        comments: 0,
        createdAt: new Date().toISOString().split('T')[0],
        images: selectedImages,
        isPending: true 
      };
      const localPosts = JSON.parse(localStorage.getItem('my_posts') || '[]');
      localStorage.setItem('my_posts', JSON.stringify([newPost, ...localPosts]));
      setPosts(prev => [newPost, ...prev]);
    }

    handleClosePosting();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 4000);
    
    setPostTitle('');
    setPostContent('');
    setSelectedImages([]);
    setSelectedTag('就诊体验');
  };

  const handleEdit = (post: ForumPost) => {
    setEditingPostId(post.id);
    setPostTitle(post.title);
    setPostContent(post.content);
    setSelectedTag(post.tags[0] || '就诊体验');
    setSelectedImages(post.images || []);
    setIsPosting(true);
    setActiveMenuId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('确认删除此贴吗？')) {
      setPosts(prev => prev.filter(p => p.id !== id));
      setActiveMenuId(null);
    }
  };

  return (
    <div className="p-5 space-y-8 relative bg-[#F2F9F6] min-h-full pb-32">
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-brand-dark text-white px-6 py-4 rounded-3xl shadow-2xl flex flex-col items-center gap-2 animate-in fade-in slide-in-from-top-4 border-2 border-brand-core">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-brand-core" />
            <span className="text-sm font-black">帖子已提交成功</span>
          </div>
          <p className="text-[10px] opacity-80 font-bold">进入后台人工审核，审核通过后将正式发布</p>
        </div>
      )}

      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-brand-dark tracking-tight">互助社区</h2>
          <p className="text-[13px] text-slate-500 font-medium">分享真实经验，传递暖心力量</p>
        </div>
        <button className="flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-2 rounded-xl text-[11px] font-black border border-red-100 shadow-sm">
          <ShieldAlert className="w-4 h-4" /> 危机预警
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5 scrollbar-hide">
        {['推荐', ...tags].map(tag => (
          <button 
            key={tag}
            className={`whitespace-nowrap px-5 py-2.5 rounded-2xl text-[11px] font-black shadow-sm transition-all border ${
              tag === '推荐' ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white border-slate-100 text-slate-500 hover:border-brand-core'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="columns-2 gap-4 space-y-4">
        {posts.map(post => (
          <div key={post.id} className="break-inside-avoid bg-white rounded-3xl overflow-hidden card-shadow border border-slate-50 flex flex-col relative group">
            {post.isPending && (
              <div className="absolute top-2 left-2 z-10 bg-black/60 backdrop-blur-md text-white px-2 py-1 rounded-lg text-[9px] font-black flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" /> 审核中
              </div>
            )}
            
            {post.images && post.images.length > 0 && (
              <div className="relative aspect-[3/4] overflow-hidden">
                <img src={post.images[0]} alt="" className="w-full h-full object-cover" />
                {post.images.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black/40 text-white px-1.5 py-0.5 rounded text-[9px] font-bold">
                    +{post.images.length - 1}
                  </div>
                )}
              </div>
            )}

            <div className="p-4 space-y-3">
              <h3 className="text-sm font-black text-slate-800 leading-tight line-clamp-2">{post.title}</h3>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black text-white ${post.userType === IdentityTag.PATIENT ? 'bg-brand-core' : 'bg-brand-orange'}`}>
                    {post.username[0]}
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 truncate max-w-[60px]">{post.username}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <Heart className="w-3 h-3" />
                  <span className="text-[10px] font-bold">{post.likes}</span>
                </div>
              </div>

              {post.userId === currentUserId && (
                <div className="pt-2 flex gap-2 border-t border-slate-50">
                  <button onClick={() => handleEdit(post)} className="flex-1 py-1.5 bg-slate-50 rounded-lg text-[9px] font-black text-slate-500 flex items-center justify-center gap-1">
                    <Edit3 className="w-2.5 h-2.5" /> 修改
                  </button>
                  <button onClick={() => handleDelete(post.id)} className="flex-1 py-1.5 bg-red-50 rounded-lg text-[9px] font-black text-red-400 flex items-center justify-center gap-1">
                    <Trash2 className="w-2.5 h-2.5" /> 删除
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* FAB: Create Post */}
      <button 
        onClick={() => {
          setIsPosting(true);
          setEditingPostId(null);
          setPostTitle('');
          setPostContent('');
          setSelectedImages([]);
        }}
        className="fixed bottom-28 right-6 w-14 h-14 bg-brand-dark text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 border-4 border-white"
      >
        <Plus className="w-8 h-8" />
      </button>

      {/* Post Modal */}
      {isPosting && (
        <div className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-t-4xl sm:rounded-4xl p-8 shadow-2xl space-y-6 animate-in slide-in-from-bottom-10 duration-300 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-brand-dark">{editingPostId ? '修改内容' : '发布动态'}</h3>
              <button onClick={handleClosePosting} className="p-2 bg-slate-50 rounded-xl text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="起个吸睛的标题 (10-100字)"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                className="w-full bg-slate-50 border-slate-100 border rounded-2xl p-4 text-sm font-black focus:ring-2 focus:ring-brand-core outline-none"
              />
              <textarea 
                placeholder="分享你的故事、心情或经验..."
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                rows={5}
                className="w-full bg-slate-50 border-slate-100 border rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-brand-core outline-none resize-none"
              />
              
              <div className="space-y-2">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">选择频道</p>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                        selectedTag === tag 
                          ? 'bg-brand-core text-white border-brand-core shadow-md' 
                          : 'bg-white text-slate-400 border-slate-100'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">上传图片 ({selectedImages.length}/9)</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 bg-brand-soft rounded-lg text-brand-dark flex items-center gap-1 transition-all active:scale-90"
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span className="text-[10px] font-black">相册</span>
                    </button>
                    <button 
                      onClick={() => cameraInputRef.current?.click()}
                      className="p-2 bg-orange-50 rounded-lg text-brand-orange flex items-center gap-1 transition-all active:scale-90"
                    >
                      <Camera className="w-4 h-4" />
                      <span className="text-[10px] font-black">拍照</span>
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 pt-2">
                  {selectedImages.map((img, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden group">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => setSelectedImages(prev => prev.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-2 h-2" />
                      </button>
                    </div>
                  ))}
                </div>

                <input type="file" ref={fileInputRef} onChange={handleImageUpload} multiple accept="image/*" className="hidden" />
                <input type="file" ref={cameraInputRef} onChange={handleImageUpload} capture="environment" accept="image/*" className="hidden" />
              </div>
            </div>

            <button 
              onClick={handlePostSubmit}
              disabled={!postTitle || !postContent}
              className={`w-full py-5 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 ${
                postTitle && postContent 
                  ? 'bg-brand-dark text-white shadow-xl shadow-brand-dark/20 active:scale-95' 
                  : 'bg-slate-100 text-slate-300'
              }`}
            >
              <Send className="w-4 h-4" /> {editingPostId ? '确认更新' : '提交审核发布'}
            </button>
            
            <p className="text-[10px] text-slate-400 text-center font-bold">
              * 为保障社区专业度，所有内容将经过后台人工审核后显示。
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityPage;
