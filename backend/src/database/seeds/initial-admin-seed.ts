import { User } from 'src/user/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class InitialCustomerData implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const userRepository = dataSource.getRepository(User);

    const existingUsers = await userRepository.find();
    if (existingUsers.length > 0) {
      console.log('User already exist, skipping seeding.');
      return;
    }

    const userData = [
      {
        email: 'johnSnow@example.com',
        username: 'John Snow',
        password: 'kingInTheNorth',
        isAdmin: true,
      },
    ];

    await userRepository.save(userData);
    console.log('User Seeding successful!');
  }

  public async revert(dataSource: DataSource): Promise<any> {
    const userRepository = dataSource.getRepository(User);
    await userRepository.clear();
    console.log('User data cleared.');
  }
}
