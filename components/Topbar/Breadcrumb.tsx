import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";
import tw from "twin.macro";
import { stringToPascalCase } from "@/utils/stringToPascalCase";

type BreadcrumbParams = {
  title?: string;
};

const OrderedList = styled.ol`
  ${tw`flex items-center gap-3 text-textogris select-none`}
`;

const Breadcrumb = ({ title = "Current Page" }: BreadcrumbParams) => {
  const router = useRouter();
  const pathSegments = router.asPath
    .split("/")
    .filter((segment) => segment !== "");
  return (
    <div>
      <nav aria-label="Breadcrumb">
        <OrderedList>
          <li>
            <Link href="/">Inicio</Link>
          </li>
          {pathSegments.map((segment, index) => (
            <li className="flex items-center space-x-2" key={index}>
              <span>/</span>
              <Link href={`/${pathSegments.slice(0, index + 1).join("/")}`}>
                {
                  stringToPascalCase(segment)
                    .replace(/-/g, " ")
                    // .replace(/[-0-9]/g, " ") // elimino los numeros del posible slug
                    .split("?")[0]
                }
              </Link>
            </li>
          ))}
        </OrderedList>
      </nav>
      {<span className="font-bold text-texto text-2xl">{title}</span>}
    </div>
  );
};

export default Breadcrumb;
