import { html } from 'lit-html';

/*

```mermaid
graph TD;
    queryConfig-->providence;
    ProvidenceConfig-->providence;
    providence-->QueryResult;
```

*/
export const providenceFlowSvg = html` <svg
  id="mermaid-1592918098747"
  width="100%"
  xmlns="http://www.w3.org/2000/svg"
  style="max-width: 316.46875px; max-height: 400px;"
  viewBox="0 0 316.46875 233"
>
  <style>
    #mermaid-1592918098747 .label {
      font-family: trebuchet ms, verdana, arial;
      color: #333;
    }
    #mermaid-1592918098747 .node circle,
    #mermaid-1592918098747 .node ellipse,
    #mermaid-1592918098747 .node polygon,
    #mermaid-1592918098747 .node rect {
      fill: #ececff;
      stroke: #9370db;
      stroke-width: 1px;
    }
    #mermaid-1592918098747 .node.clickable {
      cursor: pointer;
    }
    #mermaid-1592918098747 .arrowheadPath {
      fill: #333;
    }
    #mermaid-1592918098747 .edgePath .path {
      stroke: #333;
      stroke-width: 1.5px;
    }
    #mermaid-1592918098747 .edgeLabel {
      background-color: #e8e8e8;
    }
    #mermaid-1592918098747 .cluster rect {
      fill: #ffffde !important;
      stroke: #aa3 !important;
      stroke-width: 1px !important;
    }
    #mermaid-1592918098747 .cluster text {
      fill: #333;
    }
    #mermaid-1592918098747 div.mermaidTooltip {
      position: absolute;
      text-align: center;
      max-width: 200px;
      max-height: 400px;
      padding: 2px;
      font-family: trebuchet ms, verdana, arial;
      font-size: 12px;
      background: #ffffde;
      border: 1px solid #aa3;
      border-radius: 2px;
      pointer-events: none;
      z-index: 100;
    }
    #mermaid-1592918098747 .actor {
      stroke: #ccf;
      fill: #ececff;
    }
    #mermaid-1592918098747 text.actor {
      fill: #000;
      stroke: none;
    }
    #mermaid-1592918098747 .actor-line {
      stroke: grey;
    }
    #mermaid-1592918098747 .messageLine0 {
      marker-end: 'url(#arrowhead)';
    }
    #mermaid-1592918098747 .messageLine0,
    #mermaid-1592918098747 .messageLine1 {
      stroke-width: 1.5;
      stroke-dasharray: '2 2';
      stroke: #333;
    }
    #mermaid-1592918098747 #arrowhead {
      fill: #333;
    }
    #mermaid-1592918098747 #crosshead path {
      fill: #333 !important;
      stroke: #333 !important;
    }
    #mermaid-1592918098747 .messageText {
      fill: #333;
      stroke: none;
    }
    #mermaid-1592918098747 .labelBox {
      stroke: #ccf;
      fill: #ececff;
    }
    #mermaid-1592918098747 .labelText,
    #mermaid-1592918098747 .loopText {
      fill: #000;
      stroke: none;
    }
    #mermaid-1592918098747 .loopLine {
      stroke-width: 2;
      stroke-dasharray: '2 2';
      marker-end: 'url(#arrowhead)';
      stroke: #ccf;
    }
    #mermaid-1592918098747 .note {
      stroke: #aa3;
      fill: #fff5ad;
    }
    #mermaid-1592918098747 .noteText {
      fill: #000;
      stroke: none;
      font-family: trebuchet ms, verdana, arial;
      font-size: 14px;
    }
    #mermaid-1592918098747 .section {
      stroke: none;
      opacity: 0.2;
    }
    #mermaid-1592918098747 .section0 {
      fill: rgba(102, 102, 255, 0.49);
    }
    #mermaid-1592918098747 .section2 {
      fill: #fff400;
    }
    #mermaid-1592918098747 .section1,
    #mermaid-1592918098747 .section3 {
      fill: #fff;
      opacity: 0.2;
    }
    #mermaid-1592918098747 .sectionTitle0,
    #mermaid-1592918098747 .sectionTitle1,
    #mermaid-1592918098747 .sectionTitle2,
    #mermaid-1592918098747 .sectionTitle3 {
      fill: #333;
    }
    #mermaid-1592918098747 .sectionTitle {
      text-anchor: start;
      font-size: 11px;
      text-height: 14px;
    }
    #mermaid-1592918098747 .grid .tick {
      stroke: #d3d3d3;
      opacity: 0.3;
      shape-rendering: crispEdges;
    }
    #mermaid-1592918098747 .grid path {
      stroke-width: 0;
    }
    #mermaid-1592918098747 .today {
      fill: none;
      stroke: red;
      stroke-width: 2px;
    }
    #mermaid-1592918098747 .task {
      stroke-width: 2;
    }
    #mermaid-1592918098747 .taskText {
      text-anchor: middle;
      font-size: 11px;
    }
    #mermaid-1592918098747 .taskTextOutsideRight {
      fill: #000;
      text-anchor: start;
      font-size: 11px;
    }
    #mermaid-1592918098747 .taskTextOutsideLeft {
      fill: #000;
      text-anchor: end;
      font-size: 11px;
    }
    #mermaid-1592918098747 .taskText0,
    #mermaid-1592918098747 .taskText1,
    #mermaid-1592918098747 .taskText2,
    #mermaid-1592918098747 .taskText3 {
      fill: #fff;
    }
    #mermaid-1592918098747 .task0,
    #mermaid-1592918098747 .task1,
    #mermaid-1592918098747 .task2,
    #mermaid-1592918098747 .task3 {
      fill: #8a90dd;
      stroke: #534fbc;
    }
    #mermaid-1592918098747 .taskTextOutside0,
    #mermaid-1592918098747 .taskTextOutside1,
    #mermaid-1592918098747 .taskTextOutside2,
    #mermaid-1592918098747 .taskTextOutside3 {
      fill: #000;
    }
    #mermaid-1592918098747 .active0,
    #mermaid-1592918098747 .active1,
    #mermaid-1592918098747 .active2,
    #mermaid-1592918098747 .active3 {
      fill: #bfc7ff;
      stroke: #534fbc;
    }
    #mermaid-1592918098747 .activeText0,
    #mermaid-1592918098747 .activeText1,
    #mermaid-1592918098747 .activeText2,
    #mermaid-1592918098747 .activeText3 {
      fill: #000 !important;
    }
    #mermaid-1592918098747 .done0,
    #mermaid-1592918098747 .done1,
    #mermaid-1592918098747 .done2,
    #mermaid-1592918098747 .done3 {
      stroke: grey;
      fill: #d3d3d3;
      stroke-width: 2;
    }
    #mermaid-1592918098747 .doneText0,
    #mermaid-1592918098747 .doneText1,
    #mermaid-1592918098747 .doneText2,
    #mermaid-1592918098747 .doneText3 {
      fill: #000 !important;
    }
    #mermaid-1592918098747 .crit0,
    #mermaid-1592918098747 .crit1,
    #mermaid-1592918098747 .crit2,
    #mermaid-1592918098747 .crit3 {
      stroke: #f88;
      fill: red;
      stroke-width: 2;
    }
    #mermaid-1592918098747 .activeCrit0,
    #mermaid-1592918098747 .activeCrit1,
    #mermaid-1592918098747 .activeCrit2,
    #mermaid-1592918098747 .activeCrit3 {
      stroke: #f88;
      fill: #bfc7ff;
      stroke-width: 2;
    }
    #mermaid-1592918098747 .doneCrit0,
    #mermaid-1592918098747 .doneCrit1,
    #mermaid-1592918098747 .doneCrit2,
    #mermaid-1592918098747 .doneCrit3 {
      stroke: #f88;
      fill: #d3d3d3;
      stroke-width: 2;
      cursor: pointer;
      shape-rendering: crispEdges;
    }
    #mermaid-1592918098747 .activeCritText0,
    #mermaid-1592918098747 .activeCritText1,
    #mermaid-1592918098747 .activeCritText2,
    #mermaid-1592918098747 .activeCritText3,
    #mermaid-1592918098747 .doneCritText0,
    #mermaid-1592918098747 .doneCritText1,
    #mermaid-1592918098747 .doneCritText2,
    #mermaid-1592918098747 .doneCritText3 {
      fill: #000 !important;
    }
    #mermaid-1592918098747 .titleText {
      text-anchor: middle;
      font-size: 18px;
      fill: #000;
    }
    #mermaid-1592918098747 g.classGroup text {
      fill: #9370db;
      stroke: none;
      font-family: trebuchet ms, verdana, arial;
      font-size: 10px;
    }
    #mermaid-1592918098747 g.classGroup rect {
      fill: #ececff;
      stroke: #9370db;
    }
    #mermaid-1592918098747 g.classGroup line {
      stroke: #9370db;
      stroke-width: 1;
    }
    #mermaid-1592918098747 .classLabel .box {
      stroke: none;
      stroke-width: 0;
      fill: #ececff;
      opacity: 0.5;
    }
    #mermaid-1592918098747 .classLabel .label {
      fill: #9370db;
      font-size: 10px;
    }
    #mermaid-1592918098747 .relation {
      stroke: #9370db;
      stroke-width: 1;
      fill: none;
    }
    #mermaid-1592918098747 #compositionEnd,
    #mermaid-1592918098747 #compositionStart {
      fill: #9370db;
      stroke: #9370db;
      stroke-width: 1;
    }
    #mermaid-1592918098747 #aggregationEnd,
    #mermaid-1592918098747 #aggregationStart {
      fill: #ececff;
      stroke: #9370db;
      stroke-width: 1;
    }
    #mermaid-1592918098747 #dependencyEnd,
    #mermaid-1592918098747 #dependencyStart,
    #mermaid-1592918098747 #extensionEnd,
    #mermaid-1592918098747 #extensionStart {
      fill: #9370db;
      stroke: #9370db;
      stroke-width: 1;
    }
    #mermaid-1592918098747 .branch-label,
    #mermaid-1592918098747 .commit-id,
    #mermaid-1592918098747 .commit-msg {
      fill: #d3d3d3;
      color: #d3d3d3;
    }
  </style>
  <style>
    #mermaid-1592918098747 {
      color: rgb(0, 0, 0);
      font: normal normal 400 normal 16px / normal 'Times New Roman';
    }
  </style>
  <g transform="translate(-12, -12)">
    <g class="output">
      <g class="clusters"></g>
      <g class="edgePaths">
        <g class="edgePath" style="opacity: 1;">
          <path
            class="path"
            d="M72.953125,59L72.953125,84L122.17626404494382,109"
            marker-end="url(#arrowhead13)"
            style="fill:none"
          ></path>
          <defs>
            <marker
              id="arrowhead13"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerUnits="strokeWidth"
              markerWidth="8"
              markerHeight="6"
              orient="auto"
            >
              <path
                d="M 0 0 L 10 5 L 0 10 z"
                class="arrowheadPath"
                style="stroke-width: 1; stroke-dasharray: 1, 0;"
              ></path>
            </marker>
          </defs>
        </g>
        <g class="edgePath" style="opacity: 1;">
          <path
            class="path"
            d="M248.1875,59L248.1875,84L198.96436095505618,109"
            marker-end="url(#arrowhead14)"
            style="fill:none"
          ></path>
          <defs>
            <marker
              id="arrowhead14"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerUnits="strokeWidth"
              markerWidth="8"
              markerHeight="6"
              orient="auto"
            >
              <path
                d="M 0 0 L 10 5 L 0 10 z"
                class="arrowheadPath"
                style="stroke-width: 1; stroke-dasharray: 1, 0;"
              ></path>
            </marker>
          </defs>
        </g>
        <g class="edgePath" style="opacity: 1;">
          <path
            class="path"
            d="M160.5703125,148L160.5703125,173L160.5703125,198"
            marker-end="url(#arrowhead15)"
            style="fill:none"
          ></path>
          <defs>
            <marker
              id="arrowhead15"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerUnits="strokeWidth"
              markerWidth="8"
              markerHeight="6"
              orient="auto"
            >
              <path
                d="M 0 0 L 10 5 L 0 10 z"
                class="arrowheadPath"
                style="stroke-width: 1; stroke-dasharray: 1, 0;"
              ></path>
            </marker>
          </defs>
        </g>
      </g>
      <g class="edgeLabels">
        <g class="edgeLabel" style="opacity: 1;" transform="">
          <g transform="translate(0,0)" class="label">
            <foreignObject width="0" height="0"
              ><div
                xmlns="http://www.w3.org/1999/xhtml"
                style="display: inline-block; white-space: nowrap;"
              >
                <span class="edgeLabel"></span></div
            ></foreignObject>
          </g>
        </g>
        <g class="edgeLabel" style="opacity: 1;" transform="">
          <g transform="translate(0,0)" class="label">
            <foreignObject width="0" height="0"
              ><div
                xmlns="http://www.w3.org/1999/xhtml"
                style="display: inline-block; white-space: nowrap;"
              >
                <span class="edgeLabel"></span></div
            ></foreignObject>
          </g>
        </g>
        <g class="edgeLabel" style="opacity: 1;" transform="">
          <g transform="translate(0,0)" class="label">
            <foreignObject width="0" height="0"
              ><div
                xmlns="http://www.w3.org/1999/xhtml"
                style="display: inline-block; white-space: nowrap;"
              >
                <span class="edgeLabel"></span></div
            ></foreignObject>
          </g>
        </g>
      </g>
      <g class="nodes">
        <g class="node" id="queryConfig" transform="translate(72.953125,39.5)" style="opacity: 1;">
          <rect rx="0" ry="0" x="-52.953125" y="-19.5" width="105.90625" height="39"></rect>
          <g class="label" transform="translate(0,0)">
            <g transform="translate(-42.953125,-9.5)">
              <foreignObject width="85.90625" height="19"
                ><div
                  xmlns="http://www.w3.org/1999/xhtml"
                  style="display: inline-block; white-space: nowrap;"
                >
                  queryConfig
                </div></foreignObject
              >
            </g>
          </g>
        </g>
        <g
          class="node"
          id="providence"
          transform="translate(160.5703125,128.5)"
          style="opacity: 1;"
        >
          <rect rx="0" ry="0" x="-49.578125" y="-19.5" width="99.15625" height="39"></rect>
          <g class="label" transform="translate(0,0)">
            <g transform="translate(-39.578125,-9.5)">
              <foreignObject width="79.15625" height="19"
                ><div
                  xmlns="http://www.w3.org/1999/xhtml"
                  style="display: inline-block; white-space: nowrap;"
                >
                  providence
                </div></foreignObject
              >
            </g>
          </g>
        </g>
        <g
          class="node"
          id="ProvidenceConfig"
          transform="translate(248.1875,39.5)"
          style="opacity: 1;"
        >
          <rect rx="0" ry="0" x="-72.28125" y="-19.5" width="144.5625" height="39"></rect>
          <g class="label" transform="translate(0,0)">
            <g transform="translate(-62.28125,-9.5)">
              <foreignObject width="124.5625" height="19"
                ><div
                  xmlns="http://www.w3.org/1999/xhtml"
                  style="display: inline-block; white-space: nowrap;"
                >
                  ProvidenceConfig
                </div></foreignObject
              >
            </g>
          </g>
        </g>
        <g
          class="node"
          id="QueryResult"
          transform="translate(160.5703125,217.5)"
          style="opacity: 1;"
        >
          <rect rx="0" ry="0" x="-53.359375" y="-19.5" width="106.71875" height="39"></rect>
          <g class="label" transform="translate(0,0)">
            <g transform="translate(-43.359375,-9.5)">
              <foreignObject width="86.71875" height="19"
                ><div
                  xmlns="http://www.w3.org/1999/xhtml"
                  style="display: inline-block; white-space: nowrap;"
                >
                  QueryResult
                </div></foreignObject
              >
            </g>
          </g>
        </g>
      </g>
    </g>
  </g>
</svg>`;

/*

```mermaid
sequenceDiagram
    participant providence
    participant InputDataService
    participant QueryService
    participant ReportService
    providence->>InputDataService: Give all search targets, based on 'queryConfig'
    InputDataService->>providence: 'InputData'
    providence->>QueryService: Run query, based on 'queryConfig'
    QueryService->>providence: 'QueryResult'
    providence->>ReportService: Give a report, based on 'QueryResult' and 'ProvidenceConfig'
    ReportService->>providence: Done...
```

*/
export const providenceInternalFlowSvg = html`
  <svg
    id="mermaid-1592918099462"
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    style="max-width:850px; max-height: 400px;"
    viewBox="-50 -10 850 371"
  >
    <style>
      #mermaid-1592918099462 .label {
        font-family: trebuchet ms, verdana, arial;
        color: #333;
      }
      #mermaid-1592918099462 .node circle,
      #mermaid-1592918099462 .node ellipse,
      #mermaid-1592918099462 .node polygon,
      #mermaid-1592918099462 .node rect {
        fill: #ececff;
        stroke: #9370db;
        stroke-width: 1px;
      }
      #mermaid-1592918099462 .node.clickable {
        cursor: pointer;
      }
      #mermaid-1592918099462 .arrowheadPath {
        fill: #333;
      }
      #mermaid-1592918099462 .edgePath .path {
        stroke: #333;
        stroke-width: 1.5px;
      }
      #mermaid-1592918099462 .edgeLabel {
        background-color: #e8e8e8;
      }
      #mermaid-1592918099462 .cluster rect {
        fill: #ffffde !important;
        stroke: #aa3 !important;
        stroke-width: 1px !important;
      }
      #mermaid-1592918099462 .cluster text {
        fill: #333;
      }
      #mermaid-1592918099462 div.mermaidTooltip {
        position: absolute;
        text-align: center;
        max-width: 200px;
        max-height: 400px;
        padding: 2px;
        font-family: trebuchet ms, verdana, arial;
        font-size: 12px;
        background: #ffffde;
        border: 1px solid #aa3;
        border-radius: 2px;
        pointer-events: none;
        z-index: 100;
      }
      #mermaid-1592918099462 .actor {
        stroke: #ccf;
        fill: #ececff;
      }
      #mermaid-1592918099462 text.actor {
        fill: #000;
        stroke: none;
      }
      #mermaid-1592918099462 .actor-line {
        stroke: grey;
      }
      #mermaid-1592918099462 .messageLine0 {
        marker-end: 'url(#arrowhead)';
      }
      #mermaid-1592918099462 .messageLine0,
      #mermaid-1592918099462 .messageLine1 {
        stroke-width: 1.5;
        stroke-dasharray: '2 2';
        stroke: #333;
      }
      #mermaid-1592918099462 #arrowhead {
        fill: #333;
      }
      #mermaid-1592918099462 #crosshead path {
        fill: #333 !important;
        stroke: #333 !important;
      }
      #mermaid-1592918099462 .messageText {
        fill: #333;
        stroke: none;
      }
      #mermaid-1592918099462 .labelBox {
        stroke: #ccf;
        fill: #ececff;
      }
      #mermaid-1592918099462 .labelText,
      #mermaid-1592918099462 .loopText {
        fill: #000;
        stroke: none;
      }
      #mermaid-1592918099462 .loopLine {
        stroke-width: 2;
        stroke-dasharray: '2 2';
        marker-end: 'url(#arrowhead)';
        stroke: #ccf;
      }
      #mermaid-1592918099462 .note {
        stroke: #aa3;
        fill: #fff5ad;
      }
      #mermaid-1592918099462 .noteText {
        fill: #000;
        stroke: none;
        font-family: trebuchet ms, verdana, arial;
        font-size: 14px;
      }
      #mermaid-1592918099462 .section {
        stroke: none;
        opacity: 0.2;
      }
      #mermaid-1592918099462 .section0 {
        fill: rgba(102, 102, 255, 0.49);
      }
      #mermaid-1592918099462 .section2 {
        fill: #fff400;
      }
      #mermaid-1592918099462 .section1,
      #mermaid-1592918099462 .section3 {
        fill: #fff;
        opacity: 0.2;
      }
      #mermaid-1592918099462 .sectionTitle0,
      #mermaid-1592918099462 .sectionTitle1,
      #mermaid-1592918099462 .sectionTitle2,
      #mermaid-1592918099462 .sectionTitle3 {
        fill: #333;
      }
      #mermaid-1592918099462 .sectionTitle {
        text-anchor: start;
        font-size: 11px;
        text-height: 14px;
      }
      #mermaid-1592918099462 .grid .tick {
        stroke: #d3d3d3;
        opacity: 0.3;
        shape-rendering: crispEdges;
      }
      #mermaid-1592918099462 .grid path {
        stroke-width: 0;
      }
      #mermaid-1592918099462 .today {
        fill: none;
        stroke: red;
        stroke-width: 2px;
      }
      #mermaid-1592918099462 .task {
        stroke-width: 2;
      }
      #mermaid-1592918099462 .taskText {
        text-anchor: middle;
        font-size: 11px;
      }
      #mermaid-1592918099462 .taskTextOutsideRight {
        fill: #000;
        text-anchor: start;
        font-size: 11px;
      }
      #mermaid-1592918099462 .taskTextOutsideLeft {
        fill: #000;
        text-anchor: end;
        font-size: 11px;
      }
      #mermaid-1592918099462 .taskText0,
      #mermaid-1592918099462 .taskText1,
      #mermaid-1592918099462 .taskText2,
      #mermaid-1592918099462 .taskText3 {
        fill: #fff;
      }
      #mermaid-1592918099462 .task0,
      #mermaid-1592918099462 .task1,
      #mermaid-1592918099462 .task2,
      #mermaid-1592918099462 .task3 {
        fill: #8a90dd;
        stroke: #534fbc;
      }
      #mermaid-1592918099462 .taskTextOutside0,
      #mermaid-1592918099462 .taskTextOutside1,
      #mermaid-1592918099462 .taskTextOutside2,
      #mermaid-1592918099462 .taskTextOutside3 {
        fill: #000;
      }
      #mermaid-1592918099462 .active0,
      #mermaid-1592918099462 .active1,
      #mermaid-1592918099462 .active2,
      #mermaid-1592918099462 .active3 {
        fill: #bfc7ff;
        stroke: #534fbc;
      }
      #mermaid-1592918099462 .activeText0,
      #mermaid-1592918099462 .activeText1,
      #mermaid-1592918099462 .activeText2,
      #mermaid-1592918099462 .activeText3 {
        fill: #000 !important;
      }
      #mermaid-1592918099462 .done0,
      #mermaid-1592918099462 .done1,
      #mermaid-1592918099462 .done2,
      #mermaid-1592918099462 .done3 {
        stroke: grey;
        fill: #d3d3d3;
        stroke-width: 2;
      }
      #mermaid-1592918099462 .doneText0,
      #mermaid-1592918099462 .doneText1,
      #mermaid-1592918099462 .doneText2,
      #mermaid-1592918099462 .doneText3 {
        fill: #000 !important;
      }
      #mermaid-1592918099462 .crit0,
      #mermaid-1592918099462 .crit1,
      #mermaid-1592918099462 .crit2,
      #mermaid-1592918099462 .crit3 {
        stroke: #f88;
        fill: red;
        stroke-width: 2;
      }
      #mermaid-1592918099462 .activeCrit0,
      #mermaid-1592918099462 .activeCrit1,
      #mermaid-1592918099462 .activeCrit2,
      #mermaid-1592918099462 .activeCrit3 {
        stroke: #f88;
        fill: #bfc7ff;
        stroke-width: 2;
      }
      #mermaid-1592918099462 .doneCrit0,
      #mermaid-1592918099462 .doneCrit1,
      #mermaid-1592918099462 .doneCrit2,
      #mermaid-1592918099462 .doneCrit3 {
        stroke: #f88;
        fill: #d3d3d3;
        stroke-width: 2;
        cursor: pointer;
        shape-rendering: crispEdges;
      }
      #mermaid-1592918099462 .activeCritText0,
      #mermaid-1592918099462 .activeCritText1,
      #mermaid-1592918099462 .activeCritText2,
      #mermaid-1592918099462 .activeCritText3,
      #mermaid-1592918099462 .doneCritText0,
      #mermaid-1592918099462 .doneCritText1,
      #mermaid-1592918099462 .doneCritText2,
      #mermaid-1592918099462 .doneCritText3 {
        fill: #000 !important;
      }
      #mermaid-1592918099462 .titleText {
        text-anchor: middle;
        font-size: 18px;
        fill: #000;
      }
      #mermaid-1592918099462 g.classGroup text {
        fill: #9370db;
        stroke: none;
        font-family: trebuchet ms, verdana, arial;
        font-size: 10px;
      }
      #mermaid-1592918099462 g.classGroup rect {
        fill: #ececff;
        stroke: #9370db;
      }
      #mermaid-1592918099462 g.classGroup line {
        stroke: #9370db;
        stroke-width: 1;
      }
      #mermaid-1592918099462 .classLabel .box {
        stroke: none;
        stroke-width: 0;
        fill: #ececff;
        opacity: 0.5;
      }
      #mermaid-1592918099462 .classLabel .label {
        fill: #9370db;
        font-size: 10px;
      }
      #mermaid-1592918099462 .relation {
        stroke: #9370db;
        stroke-width: 1;
        fill: none;
      }
      #mermaid-1592918099462 #compositionEnd,
      #mermaid-1592918099462 #compositionStart {
        fill: #9370db;
        stroke: #9370db;
        stroke-width: 1;
      }
      #mermaid-1592918099462 #aggregationEnd,
      #mermaid-1592918099462 #aggregationStart {
        fill: #ececff;
        stroke: #9370db;
        stroke-width: 1;
      }
      #mermaid-1592918099462 #dependencyEnd,
      #mermaid-1592918099462 #dependencyStart,
      #mermaid-1592918099462 #extensionEnd,
      #mermaid-1592918099462 #extensionStart {
        fill: #9370db;
        stroke: #9370db;
        stroke-width: 1;
      }
      #mermaid-1592918099462 .branch-label,
      #mermaid-1592918099462 .commit-id,
      #mermaid-1592918099462 .commit-msg {
        fill: #d3d3d3;
        color: #d3d3d3;
      }
    </style>
    <style>
      #mermaid-1592918099462 {
        color: rgb(0, 0, 0);
        font: normal normal 400 normal 16px / normal 'Times New Roman';
      }
    </style>
    <g></g>
    <g>
      <line
        id="actor0"
        x1="75"
        y1="5"
        x2="75"
        y2="360"
        class="actor-line"
        stroke-width="0.5px"
        stroke="#999"
      ></line>
      <rect
        x="0"
        y="0"
        fill="#eaeaea"
        stroke="#666"
        width="150"
        height="65"
        rx="3"
        ry="3"
        class="actor"
      ></rect>
      <text
        x="75"
        y="32.5"
        dominant-baseline="central"
        alignment-baseline="central"
        class="actor"
        style="text-anchor: middle;"
      >
        <tspan x="75" dy="0">providence</tspan>
      </text>
    </g>
    <g>
      <line
        id="actor1"
        x1="275"
        y1="5"
        x2="275"
        y2="360"
        class="actor-line"
        stroke-width="0.5px"
        stroke="#999"
      ></line>
      <rect
        x="200"
        y="0"
        fill="#eaeaea"
        stroke="#666"
        width="150"
        height="65"
        rx="3"
        ry="3"
        class="actor"
      ></rect>
      <text
        x="275"
        y="32.5"
        dominant-baseline="central"
        alignment-baseline="central"
        class="actor"
        style="text-anchor: middle;"
      >
        <tspan x="275" dy="0">InputDataService</tspan>
      </text>
    </g>
    <g>
      <line
        id="actor2"
        x1="475"
        y1="5"
        x2="475"
        y2="360"
        class="actor-line"
        stroke-width="0.5px"
        stroke="#999"
      ></line>
      <rect
        x="400"
        y="0"
        fill="#eaeaea"
        stroke="#666"
        width="150"
        height="65"
        rx="3"
        ry="3"
        class="actor"
      ></rect>
      <text
        x="475"
        y="32.5"
        dominant-baseline="central"
        alignment-baseline="central"
        class="actor"
        style="text-anchor: middle;"
      >
        <tspan x="475" dy="0">QueryService</tspan>
      </text>
    </g>
    <g>
      <line
        id="actor3"
        x1="675"
        y1="5"
        x2="675"
        y2="360"
        class="actor-line"
        stroke-width="0.5px"
        stroke="#999"
      ></line>
      <rect
        x="600"
        y="0"
        fill="#eaeaea"
        stroke="#666"
        width="150"
        height="65"
        rx="3"
        ry="3"
        class="actor"
      ></rect>
      <text
        x="675"
        y="32.5"
        dominant-baseline="central"
        alignment-baseline="central"
        class="actor"
        style="text-anchor: middle;"
      >
        <tspan x="675" dy="0">ReportService</tspan>
      </text>
    </g>
    <defs>
      <marker id="arrowhead" refX="5" refY="2" markerWidth="6" markerHeight="4" orient="auto">
        <path d="M 0,0 V 4 L6,2 Z"></path>
      </marker>
    </defs>
    <defs>
      <marker id="crosshead" markerWidth="15" markerHeight="8" orient="auto" refX="16" refY="4">
        <path
          fill="black"
          stroke="#000000"
          stroke-width="1px"
          d="M 9,2 V 6 L16,4 Z"
          style="stroke-dasharray: 0, 0;"
        ></path>
        <path
          fill="none"
          stroke="#000000"
          stroke-width="1px"
          d="M 0,1 L 6,7 M 6,1 L 0,7"
          style="stroke-dasharray: 0, 0;"
        ></path>
      </marker>
    </defs>
    <g>
      <text x="175" y="93" class="messageText" style="text-anchor: middle;">
        Give all search targets, based on 'queryConfig'
      </text>
      <line
        x1="75"
        y1="100"
        x2="275"
        y2="100"
        class="messageLine0"
        stroke-width="2"
        stroke="black"
        marker-end="url(#arrowhead)"
        style="fill: none;"
      ></line>
    </g>
    <g>
      <text x="175" y="128" class="messageText" style="text-anchor: middle;">'InputData'</text>
      <line
        x1="275"
        y1="135"
        x2="75"
        y2="135"
        class="messageLine0"
        stroke-width="2"
        stroke="black"
        marker-end="url(#arrowhead)"
        style="fill: none;"
      ></line>
    </g>
    <g>
      <text x="275" y="163" class="messageText" style="text-anchor: middle;">
        Run query, based on 'queryConfig'
      </text>
      <line
        x1="75"
        y1="170"
        x2="475"
        y2="170"
        class="messageLine0"
        stroke-width="2"
        stroke="black"
        marker-end="url(#arrowhead)"
        style="fill: none;"
      ></line>
    </g>
    <g>
      <text x="275" y="198" class="messageText" style="text-anchor: middle;">'QueryResult'</text>
      <line
        x1="475"
        y1="205"
        x2="75"
        y2="205"
        class="messageLine0"
        stroke-width="2"
        stroke="black"
        marker-end="url(#arrowhead)"
        style="fill: none;"
      ></line>
    </g>
    <g>
      <text x="375" y="233" class="messageText" style="text-anchor: middle;">
        Give a report, based on 'QueryResult' and 'ProvidenceConfig'
      </text>
      <line
        x1="75"
        y1="240"
        x2="675"
        y2="240"
        class="messageLine0"
        stroke-width="2"
        stroke="black"
        marker-end="url(#arrowhead)"
        style="fill: none;"
      ></line>
    </g>
    <g>
      <text x="375" y="268" class="messageText" style="text-anchor: middle;">Done...</text>
      <line
        x1="675"
        y1="275"
        x2="75"
        y2="275"
        class="messageLine0"
        stroke-width="2"
        stroke="black"
        marker-end="url(#arrowhead)"
        style="fill: none;"
      ></line>
    </g>
    <g>
      <rect
        x="0"
        y="295"
        fill="#eaeaea"
        stroke="#666"
        width="150"
        height="65"
        rx="3"
        ry="3"
        class="actor"
      ></rect>
      <text
        x="75"
        y="327.5"
        dominant-baseline="central"
        alignment-baseline="central"
        class="actor"
        style="text-anchor: middle;"
      >
        <tspan x="75" dy="0">providence</tspan>
      </text>
    </g>
    <g>
      <rect
        x="200"
        y="295"
        fill="#eaeaea"
        stroke="#666"
        width="150"
        height="65"
        rx="3"
        ry="3"
        class="actor"
      ></rect>
      <text
        x="275"
        y="327.5"
        dominant-baseline="central"
        alignment-baseline="central"
        class="actor"
        style="text-anchor: middle;"
      >
        <tspan x="275" dy="0">InputDataService</tspan>
      </text>
    </g>
    <g>
      <rect
        x="400"
        y="295"
        fill="#eaeaea"
        stroke="#666"
        width="150"
        height="65"
        rx="3"
        ry="3"
        class="actor"
      ></rect>
      <text
        x="475"
        y="327.5"
        dominant-baseline="central"
        alignment-baseline="central"
        class="actor"
        style="text-anchor: middle;"
      >
        <tspan x="475" dy="0">QueryService</tspan>
      </text>
    </g>
    <g>
      <rect
        x="600"
        y="295"
        fill="#eaeaea"
        stroke="#666"
        width="150"
        height="65"
        rx="3"
        ry="3"
        class="actor"
      ></rect>
      <text
        x="675"
        y="327.5"
        dominant-baseline="central"
        alignment-baseline="central"
        class="actor"
        style="text-anchor: middle;"
      >
        <tspan x="675" dy="0">ReportService</tspan>
      </text>
    </g>
  </svg>
`;
