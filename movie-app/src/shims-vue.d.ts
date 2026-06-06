declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// Allow TypeScript to resolve path-alias imports like @/components/...
declare module "@/*" {
  const anyExport: any;
  export default anyExport;
}

// Specific UI module stubs for named imports
declare module "@/components/ui/card" {
  import { DefineComponent } from "vue";
  export const Card: DefineComponent<any, any, any>;
  export const CardContent: DefineComponent<any, any, any>;
  export const CardHeader: DefineComponent<any, any, any>;
  export const CardTitle: DefineComponent<any, any, any>;
  export default Card;
}

declare module "@/components/ui/button" {
  import { DefineComponent } from "vue";
  export const Button: DefineComponent<any, any, any>;
  export default Button;
}

declare module "@/components/ui/input" {
  import { DefineComponent } from "vue";
  export const Input: DefineComponent<any, any, any>;
  export default Input;
}

declare module "@/components/ui/textarea" {
  import { DefineComponent } from "vue";
  export const Textarea: DefineComponent<any, any, any>;
  export default Textarea;
}

declare module "@/components/ui/dialog" {
  import { DefineComponent } from "vue";
  export const Dialog: DefineComponent<any, any, any>;
  export const DialogContent: DefineComponent<any, any, any>;
  export const DialogHeader: DefineComponent<any, any, any>;
  export const DialogTitle: DefineComponent<any, any, any>;
  export const DialogTrigger: DefineComponent<any, any, any>;
  export default Dialog;
}

// Static assets
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.svg";
declare module "*.gif";
