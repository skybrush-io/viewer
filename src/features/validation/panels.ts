import AltitudeChartPanel from './AltitudeChartPanel';
import HorizontalAccelerationChartPanel from './HorizontalAccelerationChartPanel';
import HorizontalVelocityChartPanel from './HorizontalVelocityChartPanel';
import ProximityChartPanel from './ProximityChartPanel';
import VerticalAccelerationChartPanel from './VerticalAccelerationChartPanel';
import VerticalVelocityChartPanel from './VerticalVelocityChartPanel';

export enum ValidationPanel {
  ALTITUDE = 'altitude',
  HORIZONTAL_VELOCITY = 'horizontalVelocity',
  VERTICAL_VELOCITY = 'verticalVelocity',
  HORIZONTAL_ACCELERATION = 'horizontalAcceleration',
  VERTICAL_ACCELERATION = 'verticalAcceleration',
  PROXIMITY = 'proximity',
}

export type PanelSpecification = {
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
    id: ValidationPanel.HORIZONTAL_ACCELERATION,
    component: HorizontalAccelerationChartPanel,
    priority: 40,
  },
  {
    id: ValidationPanel.VERTICAL_ACCELERATION,
    component: VerticalAccelerationChartPanel,
    priority: 50,
  },
  {
    id: ValidationPanel.PROXIMITY,
    component: ProximityChartPanel,
    priority: 60,
  },
];

/**
 * Finds the specification of a panel with the given identifier.
 *
 * Returns the specification of the panel or undefined if there is no such
 * panel with the given ID.
 */
export const findPanelById = (
  id: ValidationPanel
): PanelSpecification | undefined => PANELS.find((p) => p.id === id);
