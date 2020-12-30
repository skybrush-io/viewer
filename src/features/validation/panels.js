import AltitudeChartPanel from './AltitudeChartPanel';
import HorizontalVelocityChartPanel from './HorizontalVelocityChartPanel';
import ProximityChartPanel from './ProximityChartPanel';
import VerticalVelocityChartPanel from './VerticalVelocityChartPanel';

export const PANELS = [
  {
    id: 'altitude',
    label: 'Altitudes',
    component: AltitudeChartPanel,
    priority: 0,
  },
  {
    id: 'horizontalVelocity',
    label: 'Horizontal velocities',
    component: HorizontalVelocityChartPanel,
    priority: 10,
  },
  {
    id: 'verticalVelocity',
    label: 'Vertical velocities',
    component: VerticalVelocityChartPanel,
    priority: 20,
  },
  {
    id: 'proximity',
    label: 'Proximity',
    component: ProximityChartPanel,
    priority: 30,
  },
];

/**
 * Finds the specification of a panel with the given identifier.
 *
 * Returns the specification of the panel or undefined if there is no such
 * panel with the given ID.
 */
export function findPanelById(id) {
  for (const panel of PANELS) {
    if (panel.id === id) {
      return panel;
    }
  }

  return undefined;
}
