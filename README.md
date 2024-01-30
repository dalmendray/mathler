# Mathler Game

React Native implementation of the Mathler game: https://www.mathler.com/

![Screenshot_1706640238](https://github.com/dalmendray/mathler/assets/4749436/9756052f-654e-4381-9522-74b64f227f89)
![Screenshot_1706640234](https://github.com/dalmendray/mathler/assets/4749436/103415b7-7a32-4b90-b145-994067ada998)

### Running the game

- Follow the steps to install expo go here: https://docs.expo.dev/
- Run `npm run android` or `npm run ios`

### Features:

- Local storage for saving game state
- Light / Dark mode
- Semi-random function generator
  - In the interest of time I wrote a semi-random generator. I control
    edge cases by manually generating valid combinations
- New game option
- Utils unit testing
- Mocked storage for testing

### TODO

1. Daily puzzle only
2. Test the game hook
3. Add some basic UI tests
4. Make the game available for testing with Expo Go
