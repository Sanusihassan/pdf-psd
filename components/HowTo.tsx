import React from "react";
import { useSelector } from "react-redux";
import { ToolState } from "../src/store";
import type { howToType } from "@/src/how-to/how-to-en";


const HowTo = ({
  howTo,
  alt,
  imgSrc,
}: {
  howTo: howToType;
  alt: string;
  imgSrc: string;
}) => {
  const stateShowTool = useSelector(
    (state: { tool: ToolState }) => state.tool.showTool
  );
  return (
    <>
      <div
        className={`how-to row align-items-center py-3${stateShowTool ? "" : " d-none"
          }`}
      >
        <div className="col-12 col-md-6 text-center image">
          <picture>
            <source
              srcSet={`/images/how-to-convert-${imgSrc}-xs.png`}
              media="(max-width: 575px)"
            />
            <source
              srcSet={`/images/how-to-convert-${imgSrc}-md.png`}
              media="(min-width: 575px) and (max-width: 1200px)"
            />
            <source
              srcSet={`/images/how-to-convert-${imgSrc}-xl.png`}
              media="(min-width: 1200px)"
            />
            <img
              src={`/pdfequips.png`}
              className="img-fluid"
              alt={alt}
              title={alt}
            />
          </picture>
        </div>
        <div className="col how-to-steps">
          <div itemScope itemType="http://schema.org/HowTo">
            <h2 itemProp="name">{howTo.name}</h2>
            <p itemProp="description">{howTo.description}</p>
            {howTo.step.map((step, index) => (
              <ol key={index} itemScope itemType="http://schema.org/HowToStep">
                <li>
                  {index === 0 ? (
                    <h3 itemProp="name">{step.name}</h3>
                  ) : index === 1 ? (
                    <h4 className="h3" itemProp="name">
                      {step.name}
                    </h4>
                  ) : index == 2 ? (
                    <h6 className="h3" itemProp="name">
                      {step.name}
                    </h6>
                  ) : (
                    <div className="h3" itemProp="name">
                      {step.name}
                    </div>
                  )}
                </li>
                <li>
                  <p itemProp="text">{step.text}</p>
                </li>
                {/* {step.map((substep, subIndex) => (
                                    <p key={subIndex}>{substep}</p>
                                ))} */}
              </ol>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HowTo;
