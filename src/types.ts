export interface NewsItem {
  slug: string;
  data: {
    title: string;
    description: string;
    pubDate: Date;
    image: {
      src: string;
      width: number;
      height: number;
      format: "png" | "jpg" | "jpeg" | "tiff" | "webp" | "gif" | "svg" | "avif";
    };
    imageAlt: string; // Required for accessibility
    category: string;
    author?: string;
  };
}

export interface ServiceItem {
  title: string;
  description: string;
  icon: string;
  link?: string;
}

export interface NavigationLink {
  label: string;
  href: string;
  highlight?: boolean;
  color?: string;
  isButton?: boolean;
  children?: NavigationLink[]; // Added support for dropdowns
}
