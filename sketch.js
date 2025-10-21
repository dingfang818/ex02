let table;

function preload() {
  table = loadTable("assets/dataset.csv", "csv", "header");
}

function setup() {
  let outerPadding = 40;
  let padding = 80; // 符号间距
  let baseSize = 20; // 符号基础半径

  // 计算列数
  let cols = floor((windowWidth - outerPadding * 2) / padding);
  let rows = ceil(table.getRowCount() / cols);

  let totalHeight = outerPadding * 2 + rows * padding;
  createCanvas(windowWidth, totalHeight);
  background(30); // 深色背景

  let colCount = 0;
  let rowCount = 0;

  // 获取列数据
  let allValues = table.getColumn("column0").map(Number);
  let minValue = min(allValues);
  let maxValue = max(allValues);

  let allValues2 = table.getColumn("column2").map(Number);
  let minValue2 = min(allValues2);
  let maxValue2 = max(allValues2);

  for (let rowNumber = 0; rowNumber < table.getRowCount(); rowNumber++) {
    let row = table.getRow(rowNumber);

    let radius = map(Number(row.get("column0")), minValue, maxValue, 10, baseSize);
    let value2Mapped = map(Number(row.get("column2")), minValue2, maxValue2, 0, 1);
    let mappedColor = lerpColor(color("orange"), color("red"), value2Mapped);

    // 计算位置
    let cx = outerPadding + colCount * padding;
    let cy = outerPadding + rowCount * padding;

    drawRadialGlyph(cx, cy, radius, mappedColor);

    colCount++;
    if (colCount == cols) {
      colCount = 0;
      rowCount++;
    }
  }
}

// 绘制放射状几何符号（类似雪花/花朵）
function drawRadialGlyph(x, y, radius, c) {
  push();
  translate(x, y);
  stroke(c);
  noFill();
  strokeWeight(2);

  let numRays = floor(random(6, 12)); // 射线数量随机
  for (let i = 0; i < numRays; i++) {
    let angle = map(i, 0, numRays, 0, TWO_PI);
    let len = radius * random(0.8, 1.5); // 射线长度略微随机
    line(0, 0, len * cos(angle), len * sin(angle));
  }

  // 中心小圆
  fill(c);
  noStroke();
  ellipse(0, 0, radius * 0.6, radius * 0.6);

  pop();
}

function draw() {
  // 不需要持续绘制
}
