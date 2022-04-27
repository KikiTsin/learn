import pkg from 'gulp-typescript';
const { createProject } = pkg;
// Has to be a hardcoded object due to build order
const packages = {
  common: createProject('./tsconfig.json'),
};

console.log(packages.common)