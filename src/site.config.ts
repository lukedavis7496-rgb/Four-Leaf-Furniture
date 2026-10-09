/**
 * Everything about the business that appears around the site. Fill in the
 * placeholders (marked TODO) and the whole site updates.
 */
export const site = {
  name: 'Four Leaf Furniture',
  shortName: 'Four Leaf',
  tagline: 'Live edge tables and furniture, made by hand.',
  description:
    'Four Leaf Furniture builds live edge tables and solid wood furniture by hand, shares what it learns along the way, and offers a free planner for your own builds.',
  // TODO: your town or region, used in the home page hero and footer.
  location: '[Your City, State]',
  // TODO: the address inquiries should come from / be answered at.
  email: 'hello@example.com',
  // TODO: real profile links; empty ones are hidden.
  social: {
    instagram: '',
    youtube: '',
    tiktok: '',
    facebook: '',
  },
  /**
   * Inquiry form endpoint. Create a free form at formspree.io and paste its
   * endpoint here (https://formspree.io/f/xxxxxxx). Until then the form shows
   * a "not connected yet" message instead of pretending to send.
   */
  formEndpoint: '',
  /** Where `npm run sync-planner` puts the planner build, under public/. */
  plannerPath: 'planner/app/',
};

export type Site = typeof site;
