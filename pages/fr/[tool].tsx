import Head from "next/head";
import NavBar from "pdfequips-navbar/NavBar";
import Tool from "../../components/Tool";

import {
  edit_page,
  tool,
  tools,
  downloadFile,
  footer,
} from "../../src/content/content-fr";
import { errors } from "../../src/content/content-fr";
import { useRouter } from "next/router";
import type { data_type } from "../[tool]";
import { OpenGraph } from "pdfequips-open-graph/OpenGraph";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";
import HowTo from "@/components/HowTo";
import { howToType } from "@/src/how-to/how-to-en";
import { howToSchemas } from "@/src/how-to/how-to-fr";
export async function getStaticPaths() {
  const paths = Object.keys(routes).map((key) => ({
    params: { tool: key.substring(1) },
  }));
  return {
    paths,
    fallback: false,
  };
}
export async function getStaticProps({
  params,
}: {
  params: {
    tool: string;
  };
}) {
  const item = routes[`/${params.tool}` as keyof typeof routes].item;
  return { props: { item } };
}

export default ({ item, lang }: { item: data_type; lang: string }) => {
  const router = useRouter();
  const { asPath } = router;
  const websiteSchema = {
    "@context": "http://schema.org",
    "@type": "WebPage",
    name: `PDFEquips ${item.title}`,
    description: item.description,
    url: `https://www.pdfequips.com${asPath}`,
  };
  const howToSchema = item.to === "/pdf-to-psd" ? howToSchemas.PDFToPSDHowTo : howToSchemas.PSDToPDFHowTo;
  return (
    <>
      <Head>
        <title>{item.seoTitle}</title>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <meta name="description" content={item.description} />
        <link rel="icon" type="image/svg+xml" href="/images/icons/logo.svg" />
        <OpenGraph
          ogUrl={`https://www.pdfequips.com/fr${item.to}`}
          ogDescription={item.description}
          ogImageWidth="1200"
          ogImageHeight="630"
          ogLocale="fr_FR"
          ogSiteName="PDFEquips"
          ogTitle={item.seoTitle}
          ogImage={`https://www.pdfequips.com/images/fr${item.to}.png`}
        />
      </Head>
      <NavBar path={item.to.replace("/", "")} lang={lang} />
      <Tool
        tools={tools}
        data={item}
        lang={lang}
        errors={errors}
        edit_page={edit_page}
        pages={edit_page.pages}
        page={edit_page.page}
        downloadFile={downloadFile}
      />
      <div className="container">
        <Features
          features={item.features} tool={item.to} />
      </div>
      <div className="container">
        <HowTo
          howTo={howToSchema as howToType}
          alt={item.seoTitle}
          imgSrc={item.to.replace("/", "")}
        />
      </div>
      <Footer footer={footer} title={item.seoTitle.split("-")[1]} />
    </>
  );
};

export const routes = {
  "/pdf-to-psd": { item: tool["PDF_to_PSD"] },
  "/psd-to-pdf": { item: tool["PSD_to_PDF"] },
};
