{ inputs, ... }:
{
  flake-file.inputs = {
    treefmt-nix.url = "github:numtide/treefmt-nix";
  };

  imports = [
    inputs.treefmt-nix.flakeModule
  ];

  perSystem =
    { pkgs, lib, ... }:
    {
      treefmt = {
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
            markdown-code-runner = {
              command = lib.getExe pkgs.markdown-code-runner;
              includes = [ "*.md" ];

              options = [
                "--config=${
                  pkgs.writers.writeTOML "markdown-code-runner-config" {
                    presets = {
                      nixfmt = {
                        command = [ (lib.getExe pkgs.nixfmt-rs) ];
                        language = "nix";
                      };
                      yaml = {
                        command = [
                          (lib.getExe pkgs.yamlfmt)
                          "-in"
                        ];
                        language = "yaml";
                      };
                    };
                  }
                }"
              ];
            };

            oxfmt = {
              excludes = [ "*.html" ];
            };
          };
        };
      };
    };
}
