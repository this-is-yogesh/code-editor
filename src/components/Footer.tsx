import { Blocks } from "lucide-react";
import Link from "next/link";
import "./Footer.css";

function Footer() {
  return (
      <footer className="parentFooter">
        <div className="insideFirstBox">
          <div className="buildfordeveloperbox">
            <Blocks className="size-5" />
            <p> Build for developers, by developers.</p>
          </div>
          <div className="sptbox">
            <Link href={"/support"} className="supportlink">
              Support
            </Link>
            <Link href={"/privacy"} className="privacylink">
              Privacy
            </Link>
            <Link href={"/terms"} className="termslink">
              Terms
            </Link>
          </div>
        </div>
      </footer>

  );
}

// function Footer() {
//   return <footer></footer>;
// }
export default Footer;
