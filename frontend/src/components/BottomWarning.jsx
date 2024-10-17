import {useNavigate } from "react-router-dom"

export function BottomWarning({label, buttonText,to}) {
    const navigate = useNavigate();
    return <div className="py-2 text-sm flex justify-center">
      <div>
        {label}
      </div>
      <div className="pointer underline pl-1 cursor-pointer" onClick={()=>{
        navigate(to)
      }}> {buttonText} </div>
    </div>
}
  