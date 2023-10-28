import { DragEvent, useState } from "react";
import Card from '@semcore/ui/card'
import { Box, Flex } from '@semcore/ui/flex-box'
import Button from '@semcore/ui/button'
import TrashM from '@semcore/ui/icon/Trash/m'
import RGL, { Layout, WidthProvider } from "react-grid-layout";

import "@semcore/ui/utils/style/var.css"
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import classes from './App.module.css'

const ResponsiveReactGridLayout = WidthProvider(RGL);
const rGLMargin = [16, 16] as [number, number];
const rGLPadding = [0, 0] as [number, number];
const rGLHandles = ["s", "w", "e", "sw", "se"] as Layout['resizeHandles'];

function App() {
  const [isWidgetDragging, setWidgetDragging] = useState<boolean>(false);
  const [layout, setLayout] = useState<Layout[]>([]);

  const handleDragEnd = () => {
    setWidgetDragging(false);
  };

  const handleMouseDown = () => {
    setWidgetDragging(true);
  };

  const handleMouseUp = () => {
    setWidgetDragging(false);
  };

  const handleDragStart = (event: DragEvent,) => {
    event?.dataTransfer?.setData("text/plain", "");
  };

  const handleDropDragOver = () => {
    return { w: 3, h: 3 };
  };

  const handleDrop = (layout: Layout[]) => {
    const id = Date.now().toString();
    const newLayout = layout.map((item) => {
      if (item.i === "__dropping-elem__") {
        item.i = id;
      }
      return item;
    });

    setLayout(newLayout);
  };


  const handleLayoutChange = (layout: Layout[]) => {
    if (isWidgetDragging) {
      return;
    }

    setLayout(layout);
  };

  return (
    <Flex
      className={classes.root}>
      <Flex className={classes.header}>
        <Card
          className={classes.draggable}
          tag={Flex}
          draggable unselectable="on"
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          Draggable
        </Card>
        <Card
          tag={Flex}
          className={classes.layoutInfo}
        >
          <Card.Body
            tag={Flex}
            className={classes.layoutInfoBody}
          >
            {layout.length > 0 ?
              JSON.stringify(layout, ['x', 'y', 'w', 'h'], 2) :
              (
                <Flex className={classes.layInfoText}>
                  Layout
                </Flex>
              )}
          </Card.Body>
        </Card>
      </Flex>
      <Flex className={classes.layOuts}>
        <Card tag={Flex} className={classes.customGrid}>
          <Card.Body tag={Flex} className={classes.customGridBody}>
            <ResponsiveReactGridLayout
              autoSize
              isBounded
              isDroppable
              useCSSTransforms
              verticalCompact={false}
              layout={layout}
              className={classes.gridLayout}
              onDrop={handleDrop}
              onDropDragOver={handleDropDragOver}
              onLayoutChange={handleLayoutChange}
              cols={12}
              rowHeight={43}
              margin={rGLMargin}
              resizeHandles={rGLHandles}
              containerPadding={rGLPadding}
            >
              {
                layout.map(({ i }) => {
                  return (
                    <Card key={i}>
                      <Card.Body
                        tag={Flex}
                        className={classes.rglItem}
                      >
                        <Button onClick={() => setLayout(prev => prev.filter(item => item.i !== i))}>
                          <TrashM />
                        </Button>
                      </Card.Body>
                    </Card>
                  )
                })
              }
            </ResponsiveReactGridLayout>
          </Card.Body>
        </Card>

        <Card tag={Flex} className={classes.nativeGrid}>
          <Card.Body tag={Box} className={classes.nativeGridBody}>
            {layout.map(({ i, x, y, w, h }) => {
              return (
                <Card
                  key={i}
                  className={classes.nativeGridItem}
                  style={{
                    gridArea: `${y + 1}/${x + 1}/span ${h}/span ${w}`
                  }}>
                  <Card.Body tag={Flex} className={classes.nativeGridItemBody} />
                </Card>
              )
            })}
          </Card.Body>
        </Card>
      </Flex>
    </Flex >
  )
}

export default App
