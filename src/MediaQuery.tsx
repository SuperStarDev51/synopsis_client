import React from "react"
import useMediaQuery from '@material-ui/core/useMediaQuery';

export const MediaQuery: React.FunctionComponent<any> = (props: any) => {
    const xs = useMediaQuery((theme:any) => theme.breakpoints.up('xs'));
    const sm = useMediaQuery((theme:any) => theme.breakpoints.up('sm'));
    const md = useMediaQuery((theme:any) => theme.breakpoints.up('md'));
    const lg = useMediaQuery((theme:any) => theme.breakpoints.up('lg'));
    const xl = useMediaQuery((theme:any) => theme.breakpoints.up('xl'));
    
  return (
    <div>
      {props.children}
    </div>
     )
}