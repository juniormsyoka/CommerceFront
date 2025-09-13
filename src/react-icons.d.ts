declare module "react-icons/*" {
  import * as React from "react";

  export interface IconBaseProps extends React.SVGProps<SVGSVGElement> {
    size?: string | number;
    color?: string;
    title?: string;
  }

  export type IconType = React.FC<IconBaseProps>;

  // 👇 Fix: use an "export *" wildcard with a catch-all type
  const icons: { [key: string]: IconType };
  export = icons;
}
