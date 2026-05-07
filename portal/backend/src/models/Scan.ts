import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

export type ScanStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface ScanAttributes {
  id: string;
  repositoryId: string;
  triggeredBy: string | null;
  status: ScanStatus;
  startedAt: Date | null;
  completedAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type ScanCreationAttributes = Optional<
  ScanAttributes,
  'id' | 'triggeredBy' | 'status' | 'startedAt' | 'completedAt'
>;

export class Scan
  extends Model<ScanAttributes, ScanCreationAttributes>
  implements ScanAttributes
{
  declare id: string;
  declare repositoryId: string;
  declare triggeredBy: string | null;
  declare status: ScanStatus;
  declare startedAt: Date | null;
  declare completedAt: Date | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

export function initScan(sequelize: Sequelize): void {
  Scan.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      repositoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'repositories', key: 'id' },
      },
      triggeredBy: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id' },
      },
      status: {
        type: DataTypes.ENUM('pending', 'running', 'completed', 'failed'),
        defaultValue: 'pending',
        allowNull: false,
      },
      startedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'scans',
      timestamps: true,
    }
  );
}
