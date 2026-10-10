import type { ThemeConfig } from 'antd';

/**
 * Ant Design theme = Figma kit v4, page "00 Cover · Design System", section STYLES (guideline 07 §2).
 * The only place colours, fonts and shadows are defined. antd exposes every token as a CSS variable
 * (e.g. var(--ant-color-primary)) for CSS Modules.
 * Not taken from Figma: disabled/hover/layout/tooltip backgrounds — antd defaults (decision FE-02).
 */
const PRIMARY = '#5577FF';
const PRIMARY_BG = '#EEF1FF';
const TEXT_SECONDARY = '#8E92BC';

export const theme: ThemeConfig = {
  token: {
    // Colour styles
    colorPrimary: PRIMARY, // brand/primary
    colorPrimaryHover: '#7792FF', // brand/primary-hover
    colorPrimaryBg: PRIMARY_BG, // brand/primary-bg
    colorInfo: PRIMARY, // info
    colorInfoBg: PRIMARY_BG, // info-bg
    colorInfoBorder: '#BBC9FF', // info-border
    colorSuccess: '#52C41A',
    colorSuccessBg: '#F6FFED',
    colorSuccessBorder: '#B7EB8F',
    colorWarning: '#FAAD14',
    colorWarningBg: '#FFFBE6',
    colorWarningBorder: '#FFE58F',
    colorError: '#FF4D4F',
    colorErrorHover: '#FF7875',
    colorErrorBg: '#FFF2F0',
    colorErrorBorder: '#FFCCC7',
    colorText: '#060606', // text/primary
    colorTextSecondary: TEXT_SECONDARY, // text/secondary
    colorTextLightSolid: '#FFFFFF', // text/inverse
    colorBorder: '#D0D5DD', // border
    colorBorderSecondary: '#F0F0F0', // border/secondary
    colorBgContainer: '#FFFFFF', // bg/container
    colorFillAlter: '#FAFAFA', // bg/subtle

    // Text styles (Inter)
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    fontSize: 14, // Body 14/22
    fontSizeSM: 12, // Small 12/20
    fontSizeHeading1: 24, // H1 24/32
    lineHeightHeading1: 32 / 24,
    fontSizeHeading2: 20, // H2 20/28
    lineHeightHeading2: 28 / 20,
    fontSizeHeading3: 16, // H3 16/24
    lineHeightHeading3: 24 / 16,

    // Radius: 6 controls · 8 alerts/modals · 12 cards (Figma style sheet)
    borderRadius: 6,
    borderRadiusLG: 8,

    // Effect styles
    boxShadowTertiary: '0 2px 8px 0 rgba(0, 0, 0, 0.06)', // shadow/card
    boxShadowSecondary: '0 6px 16px 0 rgba(0, 0, 0, 0.12)', // shadow/popup
    controlOutline: 'rgba(85, 119, 255, 0.15)', // focus-ring
    controlOutlineWidth: 2,
  },
  components: {
    // Web/App Shell: Sider 252 + Header 64
    Layout: {
      headerHeight: 64,
      headerPadding: '0 24px',
      headerBg: 'transparent',
      siderBg: '#FFFFFF',
    },
    // Web/Menu Item: 220 × 40, radius 8, 4 px apart; selected = brand/primary-bg + brand/primary
    Menu: {
      itemHeight: 40,
      itemBorderRadius: 8,
      itemMarginInline: 0,
      itemMarginBlock: 2,
      itemPaddingInline: 16,
      itemColor: TEXT_SECONDARY,
      itemSelectedBg: PRIMARY_BG,
      itemSelectedColor: PRIMARY,
      activeBarBorderWidth: 0,
    },
    Card: { borderRadiusLG: 12 },
    // Web/Table/Header Cell + Cell: padding 12 × 8, header on bg/subtle with Body Strong (Inter Medium) titles;
    // a sorted column is not tinted (Figma has no sort highlight).
    Table: {
      cellPaddingBlock: 12,
      cellPaddingInline: 8,
      headerBg: '#FAFAFA', // bg/subtle
      headerSortActiveBg: '#FAFAFA',
      headerSortHoverBg: '#F0F0F0', // border/secondary
      bodySortBg: 'transparent',
      fontWeightStrong: 500, // Body Strong
    },
    Typography: { titleMarginTop: 0, titleMarginBottom: 0 },
  },
};
