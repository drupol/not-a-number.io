{ inputs, ... }:
{
  flake-file.inputs = {
    treefmt-nix.url = "github:numtide/treefmt-nix";
    json-sort.url = "github:drupol/json-sort";
  };

  imports = [
    inputs.treefmt-nix.flakeModule
  ];

  perSystem =
    { pkgs, ... }:
    {
      treefmt = {
        imports = [
          inputs.json-sort.treefmtModules.default
        ];
        projectRootFile = "flake.nix";
        programs = {
          deadnix.enable = true;
          jsonfmt.enable = true;
          json-sort.enable = true;
          nixfmt = {
            enable = true;
            package = pkgs.nixfmt-rs;
          };
          oxfmt.enable = true;
          taplo.enable = true;
          yamlfmt.enable = true;
        };
        settings = {
          no-cache = true;
          on-unmatched = "warn";
          formatter = {
            oxfmt = {
              excludes = [ "*.html" ];
            };
          };
        };
      };
    };
}
