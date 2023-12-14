interface Tag {
  _id?: string;
  name: string;
  posts?: string[];
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

type TagCategory = "featured-tag" | "related" | "random";

interface TagPayload {
  category?: TagCategory;
}
