import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

interface KeyVal<T> {
    Key: string,
    Val: T;
    Icon: any;
}

export default KeyVal;
