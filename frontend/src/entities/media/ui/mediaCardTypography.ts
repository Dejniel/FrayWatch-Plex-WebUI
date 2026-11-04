/** Resolve against the card's inline-size container, independently of screen width. */
export const mediaCardTypography = {
  title: {
    fontSize: "clamp(1rem, 4.8cqi, 1.25rem)",
    lineHeight: 1.3,
  },
  subtitle: {
    fontSize: "clamp(0.8125rem, 3.6cqi, 1rem)",
    lineHeight: 1.4,
  },
  badge: {
    fontSize: "clamp(0.6875rem, 2.7cqi, 0.8125rem)",
    lineHeight: 1.2,
  },
};
