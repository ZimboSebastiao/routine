import tasks from '@/app/(tabs)/tasks';
import { getCurrentWeekInfo } from '@/utils/pointsSystem';
import { getHabits, getTasks } from '@/utils/storage';
import React, { useEffect, useState } from "react";
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

interface ChartData {
  name: string;
  percentage: number;
  color: string;
  totalHours: number;
}

export default function ScrollableBarChart() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  
  const loadChartData = async () => {
    try {
      const weekInfo = await getCurrentWeekInfo();
      const weekStart = new Date(weekInfo.weekStart);
      const weekEnd = new Date(weekInfo.weekEnd);
      
      const habits = await getHabits();
      const allTasks = await getTasks();
      
      const weeklyTasks = allTasks.filter(task => 
        task.completed && 
        task.timeSpent && 
        new Date(task.createdAt) >= weekStart && 
        new Date(task.createdAt) <= weekEnd
      );
      
      const habitsWithTime: ChartData[] = habits.map(habit => {
        const habitTasks = weeklyTasks.filter(task => task.habitId === habit.id);
        const totalSeconds = habitTasks.reduce((sum, task) => sum + (task.timeSpent || 0), 0);
        const totalHours = totalSeconds / 3600;
        
        return {
          name: habit.title,
          totalHours,
          percentage: Math.min(Math.round((totalHours / 1) * 100), 100), // 1h = 100%
          color: habit.color || getRandomColor()
        };
      });
      
      const sortedData = habitsWithTime
        .sort((a, b) => b.totalHours - a.totalHours)
        .slice(0, 5);
      
      setChartData(sortedData);
    } catch (error) {
      console.error('Error loading chart data:', error);
    }
  };

  useEffect(() => {
    loadChartData();
    
    const interval = setInterval(loadChartData, 30000);
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    loadChartData();
  }, [tasks]); 

  const getRandomColor = () => {
    const colors = ['#4B2E2B', '#84B94E', '#E08ED3', '#5D8BF4', '#FF9F43'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const chartWidth = chartData.length * (BAR_WIDTH + GAP);

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

          {chartData.map((subject, index) => {
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
                  <>
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
                    <SvgText
                      x={x + BAR_WIDTH / 2}
                      y={emptyHeight + filledHeight / 2 + 25}
                      fill="#fff"
                      fontSize="12"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                    </SvgText>
                  </>
                )}

                {/* Label */}
                <SvgText
                  x={x + BAR_WIDTH / 2}
                  y={GRAPH_HEIGHT + 25}
                  fontSize="16"
                  fill="#333"
                  textAnchor="middle"
                >
                  {subject.name.length > 10 
                    ? subject.name.substring(0, 10) + '...' 
                    : subject.name}
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