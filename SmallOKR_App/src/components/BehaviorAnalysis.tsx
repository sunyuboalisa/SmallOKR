import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { TodoContext, TodoDispatchContext } from '../state/TodoContext';
import { TargetContext, TargetDispatchContext } from '../state/TargetContext';
import dayjs from 'dayjs';
import useTargetService from '../service/TargetService';
import useTodoService from '../service/TodoService';

const BehaviorAnalysis = () => {
  const targetService = useTargetService();
  const todoService = useTodoService();
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>(
    'daily',
  );
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const screenWidth = Dimensions.get('window').width;
  const targetContext = useContext(TargetContext);
  const todoContext = useContext(TodoContext);
  const dispatch = useContext(TargetDispatchContext);
  const todoDispatch = useContext(TodoDispatchContext);
  const fetchData = async () => {
    try {
      const res = await targetService.getTargets();
      const newState = res.data.data.map((value: any) => ({
        id: value.id || '',
        name: value.name || '未命名目标',
        description: value.description || '',
        status: value.status || 0,
      }));

      const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
      const localDateTime = now;
      const todoRes = await todoService.getTodosByDate(localDateTime);
      const todos = todoRes.data.data;
      todoDispatch({ type: 'Load', newTodos: todos });
      dispatch({ type: 'Load', targets: newState });
      console.log(todoContext.todos);
    } catch (e) {
      console.error('获取目标数据失败:', e);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch, todoDispatch, targetContext.reload, todoContext.reload]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // 处理目标状态分布
  const processTargetStatus = () => {
    const statusData = [
      {
        name: '未开始',
        value: 0,
        color: '#FF6B6B',
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      },
      {
        name: '进行中',
        value: 0,
        color: '#4ECDC4',
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      },
      {
        name: '已完成',
        value: 0,
        color: '#45B7D1',
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      },
      {
        name: '未设置',
        value: 0,
        color: '#CCCCCC',
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      },
    ];

    if (targetContext?.targets && Array.isArray(targetContext.targets)) {
      targetContext.targets.forEach(target => {
        if (!target) return;

        const status = target.status || 0;
        if (status === 0) statusData[0].value++;
        else if (status === 1) statusData[1].value++;
        else if (status === 2) statusData[2].value++;
        else statusData[3].value++;
      });
    }

    return statusData.filter(item => item && item.value > 0);
  };

  // 处理待办时间分布
  const processTodoTimeDistribution = () => {
    const timeSlots = [
      { label: '早晨 (6-12)', count: 0 },
      { label: '下午 (12-18)', count: 0 },
      { label: '晚上 (18-24)', count: 0 },
      { label: '凌晨 (0-6)', count: 0 },
    ];

    if (todoContext?.todos && Array.isArray(todoContext.todos)) {
      todoContext.todos.forEach(todo => {
        if (!todo?.beginDate) return;

        const hour = parseInt(todo.beginDate.split(':')[0]) || 0;
        if (hour >= 6 && hour < 12) timeSlots[0].count++;
        else if (hour >= 12 && hour < 18) timeSlots[1].count++;
        else if (hour >= 18) timeSlots[2].count++;
        else timeSlots[3].count++;
      });
    }

    return timeSlots;
  };

  // 处理结果趋势数据
  const processResultTrend = () => {
    const now = new Date();
    let filteredResults: any[] = [];

    if (targetContext?.results && Array.isArray(targetContext.results)) {
      switch (activeTab) {
        case 'daily':
          filteredResults = targetContext.results.filter(
            r =>
              r?.creTime &&
              new Date(r.creTime).toDateString() === now.toDateString(),
          );
          break;
        case 'weekly':
          const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
          filteredResults = targetContext.results.filter(
            r => r?.creTime && new Date(r.creTime) >= weekStart,
          );
          break;
        case 'monthly':
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          filteredResults = targetContext.results.filter(
            r => r?.creTime && new Date(r.creTime) >= monthStart,
          );
          break;
      }
    }

    // 按目标分组统计
    const targetCompletion = (targetContext?.targets || []).map(target => {
      const targetResults = filteredResults.filter(
        r => r?.targetId === target?.id,
      );
      return {
        targetId: target?.id || '',
        targetName: target?.name || '未命名目标',
        count: targetResults.length,
      };
    });

    return {
      labels: targetCompletion.map(
        t =>
          t.targetName.substring(0, 5) + (t.targetName.length > 5 ? '...' : ''),
      ),
      data: targetCompletion.map(t => t.count),
      rawData: filteredResults,
    };
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6ab04c" />
        <Text style={styles.loadingText}>数据加载中...</Text>
      </View>
    );
  }

  const targetStatusData = processTargetStatus();
  const todoTimeData = processTodoTimeDistribution();
  const resultTrendData = processResultTrend();

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* 时间筛选标签 */}
      <View style={styles.tabContainer}>
        {(['daily', 'weekly', 'monthly'] as const).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab === 'daily'
                ? '日统计'
                : tab === 'weekly'
                ? '周统计'
                : '月统计'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 目标状态分布饼图 */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>
          目标状态分布 ({targetContext?.targets?.length || 0})
        </Text>
        {targetStatusData?.length > 0 ? (
          <PieChart
            data={targetStatusData}
            width={screenWidth - 40}
            height={220}
            accessor="value"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
            hasLegend
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
          />
        ) : (
          <Text style={styles.noDataText}>暂无目标状态数据</Text>
        )}
      </View>

      {/* 待办时间分布柱状图 */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>
          待办时间分布 ({todoContext?.todos?.length || 0})
        </Text>
        {todoContext?.todos?.length > 0 ? (
          <BarChart
            data={{
              labels: todoTimeData.map(item => item.label),
              datasets: [
                {
                  data: todoTimeData.map(item => item.count),
                },
              ],
            }}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(155, 89, 182, ${opacity})`,
            }}
            fromZero
            yAxisLabel="Count"
            yAxisSuffix="%"
          />
        ) : (
          <Text style={styles.noDataText}>暂无待办数据</Text>
        )}
      </View>

      {/* 结果趋势折线图 */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>
          完成趋势 ({resultTrendData?.rawData?.length || 0})
        </Text>
        {resultTrendData?.labels?.length > 0 ? (
          <LineChart
            data={{
              labels: resultTrendData.labels,
              datasets: [
                {
                  data: resultTrendData.data,
                  color: (opacity = 1) => `rgba(106, 176, 76, ${opacity})`,
                  strokeWidth: 2,
                },
              ],
            }}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
          />
        ) : (
          <Text style={styles.noDataText}>暂无完成数据</Text>
        )}
      </View>

      {/* 详细记录列表 */}
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>
          详细记录 (
          {activeTab === 'daily'
            ? '今日'
            : activeTab === 'weekly'
            ? '本周'
            : '本月'}
          )
        </Text>

        {resultTrendData?.rawData?.length > 0 ? (
          resultTrendData.rawData.map((result, index) => {
            const relatedTarget = targetContext?.targets?.find(
              t => t?.id === result?.targetId,
            );
            return (
              <View key={`${result?.id || index}`} style={styles.listItem}>
                <View style={styles.listItemContent}>
                  <Text style={styles.listItemTitle}>
                    {result?.name || '未命名记录'}
                  </Text>
                  {relatedTarget && (
                    <Text style={styles.listItemSubtitle}>
                      关联目标: {relatedTarget.name}
                    </Text>
                  )}
                  <Text style={styles.listItemTime}>
                    {result?.creTime
                      ? new Date(result.creTime).toLocaleString()
                      : '未知时间'}
                  </Text>
                </View>
                <Text style={styles.listItemValue}>
                  {result?.value || '无值'}
                </Text>
              </View>
            );
          })
        ) : (
          <Text style={styles.noDataText}>暂无记录数据</Text>
        )}
      </View>
    </ScrollView>
  );
};

// 图表配置
const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '5',
    strokeWidth: '2',
    stroke: '#6ab04c',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#6ab04c',
  },
  tabText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  noDataText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 20,
  },
  listContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  listItemContent: {
    flex: 1,
    marginRight: 10,
  },
  listItemTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  listItemSubtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  listItemTime: {
    fontSize: 12,
    color: '#999',
  },
  listItemValue: {
    fontSize: 14,
    color: '#6ab04c',
    fontWeight: '500',
  },
});

export default BehaviorAnalysis;
