import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useListBlogPosts } from "@workspace/api-client-react";
import { Star, ArrowRight, Calendar, User } from "lucide-react";

type FilterType = "all" | "blog" | "testimonial" | "success_story";

const typeLabels: Record<string, string> = {
  blog: "Blog",
  testimonial: "Testimonial",
  success_story: "Success Story"
};

const typeBadgeColors: Record<string, string> = {
  blog: "bg-primary/10 text-primary",
  testimonial: "bg-secondary/10 text-secondary-foreground",
  success_story: "bg-green-100 text-green-700"
};

export default function Blog() {
  const [filter, setFilter] = useState<FilterType>("all");
  const { data: posts, isLoading } = useListBlogPosts(
    filter !== "all" ? { type: filter } : {}
  );

  const tabs: { key: FilterType; label: string }[] = [
    { key: "all", label: "All" },
    { key: "blog", label: "Blog" },
    { key: "testimonial", label: "Testimonials" },
    { key: "success_story", label: "Success Stories" }
  ];

  return (
    <div className="flex flex-col w-full">
      <section className="bg-muted py-24">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
            Blog, Success Stories & Testimonials
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Read about the latest in physiotherapy research, patient recovery stories, and what our patients say about their experience.
          </p>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-3 mb-12">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                data-testid={`tab-${tab.key}`}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                  filter === tab.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Posts Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-card border border-card-border rounded-2xl overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-6">
                      <Skeleton className="h-4 w-1/4 mb-3" />
                      <Skeleton className="h-6 w-full mb-2" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                  </div>
                ))
              : (posts ?? []).map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.id}`}
                    data-testid={`card-post-${post.id}`}
                  >
                    <div className="bg-card border border-card-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
                      <div className="bg-primary/10 h-48 flex items-center justify-center">
                        <span className="text-4xl font-bold text-primary">
                          {post.title[0]}
                        </span>
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${typeBadgeColors[post.type] ?? "bg-muted text-muted-foreground"}`}>
                            {typeLabels[post.type] ?? post.type}
                          </span>
                          {post.rating && (
                            <div className="flex items-center gap-1 ml-auto">
                              {Array.from({ length: post.rating }).map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2 leading-snug">{post.title}</h3>
                        {post.excerpt && (
                          <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-4">
                            {post.excerpt}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto pt-4 border-t border-border">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {post.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(post.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </section>
    </div>
  );
}
