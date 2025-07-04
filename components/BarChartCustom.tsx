import React from "react";
import {
	Dimensions,
	ScrollView,
	StyleSheet,
	View
} from "react-native";
import Svg, { ClipPath, Defs, G, Pattern, Rect, Text as SvgText } from "react-native-svg";

const screenWidth = Dimensions.get("window").width;
const GRAPH_HEIGHT = 310;
const RADIUS = 50;
const BAR_WIDTH = 90;
const GAP = 20;

const subjects = [
  { name: "Matemática", percentage: 78, color: "#4B2E2B" },
  { name: "Inglês", percentage: 57, color: "#84B94E" },
  { name: "Programação", percentage: 40, color: "#E08ED3" },
];

const chartWidth = subjects.length * (BAR_WIDTH + GAP);

export default function ScrollableBarChart() {
	
  return (
    <View>
      <ScrollView
        horizontal
        contentContainerStyle={{ paddingHorizontal: 16 }}
        showsHorizontalScrollIndicator={false}
      >
		<Svg height={GRAPH_HEIGHT + 60} width={chartWidth}>
		<Defs>
			{/* Padrão listrado para o fundo das barras */}
			<Pattern
			id="striped-bg"
			patternUnits="userSpaceOnUse"
			width="8"
			height="8"
			patternTransform="rotate(45)"
			>
			<Rect x="0" y="0" width="10" height="10" fill="#eee" />
			<Rect x="0" y="0" width="5" height="10" fill="#ddd" />
			</Pattern>
		</Defs>

		{subjects.map((subject, index) => {
			const x = index * (BAR_WIDTH + GAP);
			const filledHeight = (subject.percentage / 100) * GRAPH_HEIGHT;
			const emptyHeight = GRAPH_HEIGHT - filledHeight;

			return (
			<G key={index}>
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

				{/* Fundo listrado */}
				<Rect
				x={x}
				y={0}
				rx={RADIUS}
				width={BAR_WIDTH}
				height={GRAPH_HEIGHT}
				fill="url(#striped-bg)"
				clipPath={`url(#clip-${index})`}
				/>

				{/* Preenchimento proporcional */}
				<Rect
				x={x}
				y={emptyHeight}
				width={BAR_WIDTH}
				height={filledHeight}
				rx={RADIUS}
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
				fontSize="16"
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

  title: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 16,
  },
});
