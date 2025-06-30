import React from "react";
import {
	Dimensions,
	Text as RNText,
	ScrollView,
	StyleSheet,
	View,
} from "react-native";
import Svg, { ClipPath, Defs, G, Rect, Text as SvgText } from "react-native-svg";

const screenWidth = Dimensions.get("window").width;
const GRAPH_HEIGHT = 300;
const RADIUS = 50;
const BAR_WIDTH = 90;
const GAP = 20;

const subjects = [
  { name: "Matemática", percentage: 48, color: "#4B2E2B" },
  { name: "Português", percentage: 33, color: "#A6511E" },
  { name: "Inglês", percentage: 27, color: "#84B94E" },
  { name: "Programação", percentage: 40, color: "#E08ED3" },
  { name: "Geografia", percentage: 12, color: "#3BAEDA" },
  { name: "Física", percentage: 25, color: "#FF5733" },
  { name: "Química", percentage: 60, color: "#33FFBA" },
  { name: "História", percentage: 10, color: "#A020F0" },
];

const chartWidth = subjects.length * (BAR_WIDTH + GAP);

export default function ScrollableBarChart() {
  return (
    <View style={styles.container}>
      <RNText style={styles.title}>Desempenho por Matéria</RNText>

      <ScrollView
        horizontal
        contentContainerStyle={{ paddingHorizontal: 16 }}
        showsHorizontalScrollIndicator={false}
      >
        <Svg height={GRAPH_HEIGHT + 60} width={chartWidth}>
          {subjects.map((subject, index) => {
            const x = index * (BAR_WIDTH + GAP);
            const filledHeight = (subject.percentage / 100) * GRAPH_HEIGHT;
            const emptyHeight = GRAPH_HEIGHT - filledHeight;

            return (
              <G key={index}>
                {/* Clip para borda arredondada */}
                <Defs>
                  <ClipPath id={`clip-${index}`}>
                    <Rect
                      x={x}
                      y={0}
                      rx={RADIUS}
                      width={BAR_WIDTH}
                      height={GRAPH_HEIGHT}
                    />
                  </ClipPath>
                </Defs>

                {/* Fundo da barra */}
                <Rect
                  x={x}
                  y={0}
                  rx={RADIUS}
                  width={BAR_WIDTH}
                  height={GRAPH_HEIGHT}
                  fill="#eee"
                  clipPath={`url(#clip-${index})`}
                />

                {/* Preenchimento proporcional */}
                <Rect
                  x={x}
                  y={emptyHeight}
                  width={BAR_WIDTH}
                  height={filledHeight}
                  fill={subject.color}
                  clipPath={`url(#clip-${index})`}
                />

                {/* Porcentagem */}
                {subject.percentage > 0 && (
                  <SvgText
                    x={x + BAR_WIDTH / 2}
                    y={emptyHeight + filledHeight / 2 + 5}
                    fill="#fff"
                    fontSize="12"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {subject.percentage}%
                  </SvgText>
                )}

                {/* Label */}
                <SvgText
                  x={x + BAR_WIDTH / 2}
                  y={GRAPH_HEIGHT + 25}
                  fontSize="12"
                  fill="#333"
                  textAnchor="middle"
                >
                  {subject.name}
                </SvgText>
              </G>
            );
          })}
        </Svg>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    backgroundColor: "#FAF5F5",
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 16,
  },
});
