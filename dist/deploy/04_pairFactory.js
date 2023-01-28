"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const func = async function (hre) {
    const { deployments, getNamedAccounts } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    await deploy('PairFactory', {
        from: deployer,
        args: [],
        log: true,
        skipIfAlreadyDeployed: false
    });
};
exports.default = func;
func.tags = ['PairFactory'];
func.id = 'pairFactory';
