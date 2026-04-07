import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetBlogPost } from "@workspace/api-client-react";
import { ArrowLeft, Star, User, Calendar } from "lucide-react";

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

export default function BlogDetail() {
  const params = useParams<{ id: string }>();
  const postId = parseInt(params.id ?? "0", 10);
  const { data: post, isLoading } = useGetBlogPost(postId, {
    query: { enabled: !!postId }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-2xl">
        <Skeleton className="h-6 w-32 mb-8" />
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="h-5 w-1/2 mb-8" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-2xl text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Article not found</h1>
        <Link href="/blog">
          <Button variant="outline">Back to Blog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <Link href="/blog" className="inline-flex items-center gap-2 text-primary hover:underline mb-8 block text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${typeBadgeColors[post.type] ?? "bg-muted text-muted-foreground"}`}>
              {typeLabels[post.type] ?? post.type}
            </span>
            {post.rating && (
              <div className="flex items-center gap-1">
                {Array.from({ length: post.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-5 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <User className="w-4 h-4" /> {post.author}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(post.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="prose prose-lg max-w-none text-foreground">
            {post.content.split("\n\n").map((paragraph, i) => (
              <p key={i} className="text-muted-foreground leading-relaxed mb-5">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-12 bg-primary/5 border border-primary/10 rounded-2xl p-8 text-center">
            <h2 className="text-xl font-bold text-foreground mb-3">Ready to start your recovery journey?</h2>
            <p className="text-muted-foreground mb-6">
              Book an appointment with one of our expert physiotherapists today.
            </p>
            <Link href="/register">
              <Button className="h-11 px-8">Book Appointment</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
