{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-parts.url = "github:hercules-ci/flake-parts";
    systems.url = "github:nix-systems/default";
  };

  outputs =
    inputs@{ ... }:
    inputs.flake-parts.lib.mkFlake { inherit inputs; } {
      systems = import inputs.systems;

      perSystem =
        { pkgs, lib, ... }:
        let
          hugo-server = pkgs.writeScriptBin "hugo-server" ''
            ${lib.getExe pkgs.hugo} server --enableGitInfo --forceSyncStatic -F
          '';
        in
        {
          # nix develop
          devShells = {
            default = pkgs.mkShellNoCC {
              packages = [
                hugo-server
                pkgs.hugo
                pkgs.pandoc
                (pkgs.aspellWithDicts (d: [
                  d.fr
                  d.en
                  d.en-computers
                ]))
              ];
            };
          };

          # nix run
          apps = {
            default = {
              type = "app";
              program = lib.getExe hugo-server;
            };
          };

        };
    };
}
