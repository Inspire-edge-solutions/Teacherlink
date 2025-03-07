import { useDispatch } from "react-redux";
import { chatSidebarToggle } from "../../../../../features/toggle/toggleSlice";
import { BsList } from 'react-icons/bs';

export default function ChatHamburger() {
  const dispatch = useDispatch();

  const chatToggle = () => {
    dispatch(chatSidebarToggle());  
  };
  return (
    <>
      <button onClick={chatToggle} className="toggle-contact">
        <span className="icon"><BsList /></span>
      </button>
    </>
  );
}
