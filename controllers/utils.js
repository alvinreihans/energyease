export const calculateAverages = (dataArray) => {
  if (dataArray.length === 0) return {};

  const totals = dataArray.reduce(
    (acc, current) => {
      return {
        energyActive: acc.energyActive + current.energy_active,
        energyReactive: acc.energyReactive + current.energy_reactive,
        totalPowerFactor: acc.totalPowerFactor + current.total_power_factor,
        powerActiveTotal: acc.powerActiveTotal + current.power_active_total,
        powerReactiveTotal:
          acc.powerReactiveTotal + current.power_reactive_total,
        powerApparentTotal:
          acc.powerApparentTotal + current.power_apparent_total,
      };
    },
    {
      energyActive: 0,
      energyReactive: 0,
      totalPowerFactor: 0,
      powerActiveTotal: 0,
      powerReactiveTotal: 0,
      powerApparentTotal: 0,
    }
  );

  const count = dataArray.length;
  return {
    avgEnergyActive: totals.energyActive / count,
    avgEnergyReactive: totals.energyReactive / count,
    avgTotalPowerFactor: totals.totalPowerFactor / count,
    avgPowerActiveTotal: totals.powerActiveTotal / count,
    avgPowerReactiveTotal: totals.powerReactiveTotal / count,
    avgPowerApparentTotal: totals.powerApparentTotal / count,
  };
};
