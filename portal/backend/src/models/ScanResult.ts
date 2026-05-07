import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

export type ScanResultSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface ScanResultAttributes {
  id: string;
  scanId: string;
  agentId: string;
  severity: ScanResultSeverity;
  category: string;
  title: string;
  description: string | null;
  filePath: string | null;
  lineNumber: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type ScanResultCreationAttributes = Optional<
  ScanResultAttributes,
  'id' | 'description' | 'filePath' | 'lineNumber'
>;

export class ScanResult
  extends Model<ScanResultAttributes, ScanResultCreationAttributes>
  implements ScanResultAttributes
{
  declare id: string;
  declare scanId: string;
  declare agentId: string;
  declare severity: ScanResultSeverity;
  declare category: string;
  declare title: string;
  declare description: string | null;
  declare filePath: string | null;
  declare lineNumber: number | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

export function initScanResult(sequelize: Sequelize): void {
  ScanResult.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      scanId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'scans', key: 'id' },
      },
      agentId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      severity: {
        type: DataTypes.ENUM('critical', 'high', 'medium', 'low', 'info'),
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      filePath: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lineNumber: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'scan_results',
      timestamps: true,
    }
  );
}
