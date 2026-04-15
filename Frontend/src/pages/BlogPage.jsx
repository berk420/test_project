import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";
import "./BlogPage.css";

export function BlogListPage() {
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.getBlogPosts({ category: category || undefined, pageSize: 12 })
      .then((d) => { setPosts(d.items || []); setTotal(d.total || 0); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="blog-page">
      <div className="blog-hero">
        <h1>Rehberler & Makaleler</h1>
        <p>Medikal turizm, tedavi bilgileri ve destinasyon rehberleri</p>
        <div className="blog-cat-tabs">
          {["", "treatment", "city", "guide"].map((c) => (
            <button key={c} className={`blog-cat-tab ${category === c ? "active" : ""}`} onClick={() => setCategory(c)}>
              {c === "" ? "Tümü" : c === "treatment" ? "Tedaviler" : c === "city" ? "Şehirler" : "Rehberler"}
            </button>
          ))}
        </div>
      </div>
      <div className="blog-content">
        {loading ? (
          <div className="blog-loading">Yükleniyor...</div>
        ) : (
          <div className="blog-grid">
            {posts.map((p) => (
              <div key={p.id} className="blog-card" onClick={() => navigate(`/blog/${p.slug}`)}>
                <img src={p.coverImageUrl} alt={p.title} />
                <div className="blog-card-body">
                  <span className="blog-card-cat">{p.category === "treatment" ? "Tedavi" : p.category === "city" ? "Şehir" : "Rehber"}</span>
                  <h3>{p.title}</h3>
                  <p>{p.summary}</p>
                  <div className="blog-card-meta">
                    <span>{p.author}</span>
                    <span>{p.viewCount?.toLocaleString()} görüntülenme</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.getBlogPost(slug).then(setPost).catch(() => {}).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="blog-loading">Yükleniyor...</div>;
  if (!post) return <div className="blog-not-found"><p>Makale bulunamadı.</p><button onClick={() => navigate("/blog")}>Geri Dön</button></div>;

  return (
    <div className="blogpost-page">
      <div className="blogpost-inner">
        <button className="blogpost-back" onClick={() => navigate("/blog")}>← Tüm Yazılar</button>
        <span className="blogpost-cat">{post.category}</span>
        <h1>{post.title}</h1>
        <div className="blogpost-meta">
          <span>{post.author}</span>
          <span>{new Date(post.publishedAt).toLocaleDateString("tr-TR")}</span>
          <span>{post.viewCount?.toLocaleString()} görüntülenme</span>
        </div>
        <img src={post.coverImageUrl} alt={post.title} className="blogpost-cover" />
        <div className="blogpost-content">{post.content}</div>
        {post.tags?.length > 0 && (
          <div className="blogpost-tags">
            {post.tags.map((t) => <span key={t} className="blogpost-tag">{t}</span>)}
          </div>
        )}
      </div>
    </div>
  );
}
