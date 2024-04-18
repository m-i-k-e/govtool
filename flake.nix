{
  description = "GovTool and utilities monorepo.";

  inputs.default_nixpkgs.url = "github:nixos/nixpkgs/c9ece0059f42e0ab53ac870104ca4049df41b133";
  inputs.node_nixpkgs.url = "github:nixos/nixpkgs/9957cd48326fe8dbd52fdc50dd2502307f188b0d";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = { self, default_nixpkgs, node_nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        defaultPkgs = import default_nixpkgs { inherit system; config.allowBroken = true; };
        nodePkgs = import node_nixpkgs { inherit system; };
        frontend = nodePkgs.callPackage ./govtool/frontend { pkgs = nodePkgs; };
      in
      {
        packages.scripts = defaultPkgs.callPackage ./scripts/govtool { pkgs = defaultPkgs; };
        packages.infra = defaultPkgs.callPackage ./infra/terraform { pkgs = defaultPkgs; };
        packages.backend = defaultPkgs.callPackage ./govtool/backend { pkgs = defaultPkgs; };
        packages.frontend = frontend.staticSite;
        packages.frontendOverride = frontend.staticSite.overrideAttrs (finalAttrs: prevAttrs: {
          VITE_BASE_URL = "https://optina.lan.disasm.us:8444";
        });
        packages.frontendModules = frontend.nodeModules;

        devShells = {
          default = defaultPkgs.mkShell { buildInputs = with nodePkgs; [ defaultPkgs.pre-commit nodejs_18 yarn ]; };
          frontend = frontend.devShell;
          # shell with js dependencies only if yarn.lock is broken and needs fixed
          js = defaultPkgs.mkShell {
            buildInputs = [ nodePkgs.nodejs_18 nodePkgs.yarn ];
          };
        };
      });
}
