// Mock Cocos Creator decorators
global.singleton = () => (constructor) => constructor;
global.inject = () => (target, propertyKey) => {};
