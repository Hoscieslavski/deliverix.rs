import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Search, 
  Calendar, 
  User, 
  Eye, 
  Clock, 
  BookOpen, 
  Tag, 
  ChevronRight,
  ChevronLeft,
  Share2,
  Bike
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  cover_image: string;
  author: string;
  tags: string[];
  read_time: string;
  created_at: string;
  views: number;
}

interface BlogPageProps {
  onBackToLanding: () => void;
  initialPostSlug?: string | null;
}

function SafeBlogImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [src]);

  if (error || !src) {
    return (
      <div className={`${className} bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 flex flex-col items-center justify-center p-6 relative overflow-hidden text-white`}>
        <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/10 blur-xl"></div>
        <div className="absolute -left-6 -top-6 w-20 h-20 rounded-full bg-white/10 blur-lg"></div>
        <div className="relative z-10 flex flex-col items-center gap-2 text-center select-none">
          <Bike className="w-8 h-8 opacity-90 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-wider opacity-80">Deliverix Blog</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      referrerPolicy="no-referrer"
    />
  );
}

export default function BlogPage({ onBackToLanding, initialPostSlug = null }: BlogPageProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCoping, setIsCoping] = useState(false);

  // Preuzmi sve postove
  useEffect(() => {
    setIsLoading(true);
    fetch('/api/blog-posts')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.posts) {
          setPosts(data.posts);
          
          // Ako imamo prosleđen početni slug, otvori taj post
          if (initialPostSlug) {
            const found = data.posts.find((p: BlogPost) => p.slug === initialPostSlug || p.id === initialPostSlug);
            if (found) {
              handleSelectPost(found);
            }
          }
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Greška pri učitavanju blogova:', err);
        setIsLoading(false);
      });
  }, [initialPostSlug]);

  // Odaberi post i poveća preglede
  const handleSelectPost = (post: BlogPost) => {
    setSelectedPost(post);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Pozovi API za čitanje posta (on takođe inkrementuje preglede na backendu)
    fetch(`/api/blog-posts/${post.slug || post.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.post) {
          // Ažuriraj lokalno stanje za preglede
          setPosts(prev => prev.map(p => p.id === post.id ? { ...p, views: data.post.views } : p));
          setSelectedPost(data.post);
        }
      })
      .catch(err => console.error('Greška pri ažuriranju pregleda:', err));
  };

  // Sve jedinstvene oznake (tagovi)
  const allTags = Array.from(
    new Set(posts.flatMap(post => post.tags || []))
  );

  // Filtrirani postovi na osnovu pretrage i oznaka
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag ? post.tags?.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  // Pomocna funkcija za kopiranje linka
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCoping(true);
    setTimeout(() => setIsCoping(false), 2000);
  };

  // Formatiranje datuma
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('sr-RS', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Pomoćne funkcije za renderovanje Markdown-a u JSX
  const parseBoldText = (text: string) => {
    const parts = text.split('**');
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index} className="font-extrabold text-gray-900">{part}</strong>;
      }
      return part;
    });
  };

  const renderMarkdown = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Heading 3
      if (line.startsWith('### ')) {
        return <h3 key={idx} className="text-xl font-bold text-gray-900 mt-6 mb-3 font-sans leading-tight">{line.replace('### ', '')}</h3>;
      }
      // Heading 2
      if (line.startsWith('## ')) {
        return <h2 key={idx} className="text-2xl font-black text-gray-900 mt-8 mb-4 border-b border-gray-100 pb-2 font-sans leading-tight">{line.replace('## ', '')}</h2>;
      }
      // Bullet list items
      if (line.startsWith('* ')) {
        const content = line.replace('* ', '');
        return (
          <li key={idx} className="ml-5 list-disc text-sm sm:text-base text-gray-700 leading-relaxed mb-2 font-sans">
            {parseBoldText(content)}
          </li>
        );
      }
      // Numbered list items
      if (/^\d+\.\s/.test(line)) {
        const content = line.replace(/^\d+\.\s/, '');
        return (
          <li key={idx} className="ml-5 list-decimal text-sm sm:text-base text-gray-700 leading-relaxed mb-2 font-sans">
            {parseBoldText(content)}
          </li>
        );
      }
      // Plain paragraph spacing
      if (line.trim() === '') {
        return <div key={idx} className="h-4" />;
      }
      return <p key={idx} className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4 font-sans">{parseBoldText(line)}</p>;
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8" id="blog-page-root">
      
      {/* Dugme za povratak */}
      <div className="flex items-center justify-between" id="blog-navigation-bar">
        <button
          onClick={() => {
            if (selectedPost) {
              setSelectedPost(null);
            } else {
              onBackToLanding();
            }
          }}
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-sky-500 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> 
          {selectedPost ? 'Nazad na listu članaka' : 'Nazad na početnu'}
        </button>
        
        {selectedPost && (
          <button
            onClick={copyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            {isCoping ? 'Link kopiran!' : 'Podeli članak'}
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4" id="blog-loading-spinner">
          <div className="w-12 h-12 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-gray-500">Učitavanje članaka...</p>
        </div>
      ) : selectedPost ? (
        /* DETALJNI PRIKAZ POSTA */
        <article className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden" id={`blog-post-view-${selectedPost.id}`}>
          {/* Cover slika */}
          <div className="h-64 sm:h-[400px] w-full overflow-hidden bg-gray-100 relative">
            <SafeBlogImage 
              src={selectedPost.cover_image} 
              alt={selectedPost.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
              <div className="flex flex-wrap gap-2">
                {selectedPost.tags?.map(tag => (
                  <span key={tag} className="px-2.5 py-1 bg-sky-500/90 text-white rounded-lg text-xs font-black">
                    #{tag}
                  </span>
                ))}
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">{selectedPost.title}</h1>
            </div>
          </div>

          {/* Meta detalji */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex flex-wrap gap-4 sm:gap-6 text-xs text-gray-500 font-bold justify-between items-center">
            <div className="flex flex-wrap gap-4 sm:gap-6">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-sky-500" /> {formatDate(selectedPost.created_at)}</span>
              <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-sky-500" /> {selectedPost.author}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-sky-500" /> {selectedPost.read_time} čitanja</span>
            </div>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-600 rounded-lg"><Eye className="w-4 h-4" /> {selectedPost.views || 0} pregleda</span>
          </div>

          {/* Sadržaj posta */}
          <div className="p-6 sm:p-10 max-w-4xl mx-auto prose prose-slate">
            <div className="mb-6 text-gray-500 italic font-medium border-l-4 border-sky-500 pl-4 text-base leading-relaxed">
              {selectedPost.summary}
            </div>
            <div className="space-y-4">
              {renderMarkdown(selectedPost.content)}
            </div>
          </div>

          {/* Podnožje članka sa pozivom na prijavu */}
          <div className="p-8 sm:p-10 bg-sky-50 border-t border-sky-100 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-extrabold text-gray-900">Inspirisao te naš članak?</h4>
              <p className="text-xs text-gray-500">Prijavi se za rad kao Wolt dostavljač i kreni da zarađuješ već ove nedelje!</p>
            </div>
            <button
              onClick={onBackToLanding}
              className="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white font-black text-xs sm:text-sm rounded-xl shadow-md shadow-sky-500/10 cursor-pointer whitespace-nowrap"
            >
              Prijavi se odmah
            </button>
          </div>
        </article>
      ) : (
        /* LISTA ČLANAKA */
        <div className="space-y-8" id="blog-list-view">
          
          {/* Header liste */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="px-3 py-1 bg-sky-50 text-sky-800 rounded-full text-xs font-black uppercase tracking-widest border border-sky-100 inline-block">Službeni blog</span>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Korisni saveti, vodiči i iskustva</h1>
            <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
              Pomažemo ti da doneseš ispravne odluke, naučiš prečice i ostvariš maksimalnu zaradu na terenu u Srbiji.
            </p>
          </div>

          {/* Filteri (Pretraga i Tagovi) */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch justify-between bg-white p-4 border border-gray-100 rounded-3xl shadow-xs" id="blog-filters">
            {/* Pretraga */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4.5 h-4.5" />
              <input
                type="text"
                placeholder="Pretraži članke po naslovu ili opisu..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10.5 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 transition"
              />
            </div>

            {/* Kategorije / Tagovi */}
            <div className="flex flex-wrap items-center gap-1.5 max-w-full md:max-w-xl">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${!selectedTag ? 'bg-sky-500 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
              >
                Svi članci
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${selectedTag === tag ? 'bg-sky-500 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Prikaz članaka u mreži */}
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="blog-grid">
              {filteredPosts.map(post => (
                <div
                  key={post.id}
                  onClick={() => handleSelectPost(post)}
                  className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md hover:border-gray-200/80 transition duration-300 flex flex-col cursor-pointer group"
                >
                  {/* Slika */}
                  <div className="h-48 overflow-hidden bg-gray-100 relative shrink-0">
                    <SafeBlogImage
                      src={post.cover_image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10px] font-black text-gray-600 shadow-xs uppercase tracking-wider">
                      {post.read_time}
                    </div>
                  </div>

                  {/* Sadržaj kartice */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags?.map((tag: string) => (
                          <span key={tag} className="px-2 py-0.5 bg-sky-50 text-sky-600 rounded-md text-[10px] font-bold">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="font-extrabold text-sm sm:text-base text-gray-900 group-hover:text-sky-500 transition line-clamp-2 leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                        {post.summary}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gray-50 flex items-center justify-between text-[11px] text-gray-400 font-bold">
                      <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {post.author}</span>
                      <span className="text-sky-500 group-hover:translate-x-1 transition-transform flex items-center gap-1 shrink-0 font-extrabold">
                        Čitaj <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-150 p-12 text-center space-y-3" id="blog-empty-state">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="font-extrabold text-gray-900">Nema pronađenih članaka</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Nažalost, nismo pronašli članke koji odgovaraju vašoj pretrazi "{searchQuery}". Pokušajte sa nekim drugim ključnim rečima.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTag(null);
                }}
                className="px-4 py-2 bg-sky-100 hover:bg-sky-200 text-sky-600 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Prikaži sve članke
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
