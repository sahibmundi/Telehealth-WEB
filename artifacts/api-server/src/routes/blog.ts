import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, blogPostsTable } from "@workspace/db";
import { ListBlogPostsQueryParams, GetBlogPostParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/blog", async (req, res): Promise<void> => {
  const query = ListBlogPostsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  let rows;
  if (query.data.type) {
    rows = await db
      .select()
      .from(blogPostsTable)
      .where(eq(blogPostsTable.type, query.data.type));
  } else {
    rows = await db.select().from(blogPostsTable);
  }

  res.json(rows.map((p) => ({
    ...p,
    publishedAt: p.publishedAt.toISOString(),
  })));
});

router.get("/blog/:id", async (req, res): Promise<void> => {
  const params = GetBlogPostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [post] = await db
    .select()
    .from(blogPostsTable)
    .where(eq(blogPostsTable.id, params.data.id));

  if (!post) {
    res.status(404).json({ error: "Blog post not found" });
    return;
  }

  res.json({ ...post, publishedAt: post.publishedAt.toISOString() });
});

export default router;
