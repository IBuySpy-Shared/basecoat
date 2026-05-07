import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

export interface RepositoryAttributes {
  id: string;
  githubId: number;
  owner: string;
  name: string;
  fullName: string;
  isPrivate: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type RepositoryCreationAttributes = Optional<
  RepositoryAttributes,
  'id' | 'isPrivate'
>;

export class Repository
  extends Model<RepositoryAttributes, RepositoryCreationAttributes>
  implements RepositoryAttributes
{
  declare id: string;
  declare githubId: number;
  declare owner: string;
  declare name: string;
  declare fullName: string;
  declare isPrivate: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

export function initRepository(sequelize: Sequelize): void {
  Repository.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      githubId: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
      },
      owner: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fullName: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      isPrivate: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'repositories',
      timestamps: true,
    }
  );
}
