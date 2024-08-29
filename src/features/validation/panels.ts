import AltitudeChartPanel from './AltitudeChartPanel';
import HorizontalVelocityChartPanel from './HorizontalVelocityChartPanel';
import ProximityChartPanel from './ProximityChartPanel';
import VerticalVelocityChartPanel from './VerticalVelocityChartPanel';

export enum ValidationPanel {
  ALTITUDE = 'altitude',
  HORIZONTAL_VELOCITY = 'horizontalVelocity',
  VERTICAL_VELOCITY = 'verticalVelocity',
  PROXIMITY = 'proximity',
}

export interface PanelSpecification {
  id: ValidationPanel;
  component: any;
  priority: number;
  height?: number;
}

export const PANELS: PanelSpecification[] = [
  {
    id: ValidationPanel.ALTITUDE,
    component: AltitudeChartPanel,
    priority: 0,
  },
  {
    id: ValidationPanel.HORIZONTAL_VELOCITY,
    component: HorizontalVelocityChartPanel,
    priority: 10,
  },
  {
    id: ValidationPanel.VERTICAL_VELOCITY,
    component: VerticalVelocityChartPanel,
    priority: 20,
  },
  {
    id: ValidationPanel.PROXIMITY,
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
export function findPanelById(
  id: ValidationPanel
): PanelSpecification | undefined {
  for (const panel of PANELS) {
    if (panel.id === id) {
      return panel;
    }
  }
}
