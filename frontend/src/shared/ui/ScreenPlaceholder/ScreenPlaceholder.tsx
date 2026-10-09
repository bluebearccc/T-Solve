import { Empty, Typography } from 'antd';

type ScreenPlaceholderProps = {
  /** SRS III number, e.g. "7.1". */
  number: string;
  /** SRS screen name, e.g. "Review Queue". */
  name: string;
};

/**
 * TEMPORARY — stands in for a screen that hasn't been built yet, so every route and menu item works from
 * day one. The feature owner replaces it with the real page (guideline 12 §1). Not a Figma kit component.
 */
export function ScreenPlaceholder({ number, name }: ScreenPlaceholderProps) {
  return (
    <Empty
      description={
        <Typography.Text type="secondary">
          {number} {name} — not built yet. See the Figma frame “{number} {name}” and SRS III.
          {number}.
        </Typography.Text>
      }
    />
  );
}
