{ inputs, ... }:
{
  flake-file.inputs = {
    make-shell.url = "github:nicknovitski/make-shell";
  };

  imports = [ inputs.make-shell.flakeModules.default ];

  perSystem =
    {
      pkgs,
      config,
      ...
    }:
    {
      make-shells.default = {
        packages = with pkgs; [
          config.packages.oss-contribs
          gnuplot
          just
          hugo
          pandoc
          mcp-server-fetch
          mcp-server-filesystem
          mcp-server-git
          mcp-server-memory
          mcp-server-sequential-thinking
          mcp-server-time
          github-mcp-server
          (aspellWithDicts (d: [
            d.fr
            d.en
            d.en-computers
          ]))
        ];
      };
    };
}
