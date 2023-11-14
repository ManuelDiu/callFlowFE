import { ImWarning } from "react-icons/im";

interface Props {
  message?: string | null
}

const WarningLine = ({ message }: Props) => {
  return (
    <div data-testid="WarningLine" className="flex gap-2 items-center">
      <ImWarning color="#958C00" size={26} />
      <p className="text-[#BBB002] max-w-full overflow-hidden truncate">{message || "Error"}</p>
    </div>
  );
};

export default WarningLine;
