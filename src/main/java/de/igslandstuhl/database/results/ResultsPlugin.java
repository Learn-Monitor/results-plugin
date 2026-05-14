package de.igslandstuhl.database.results;

import de.igslandstuhl.database.plugins.Plugin;

public class ResultsPlugin extends Plugin {
    private ResultsPluginConfig config;

    @Override
    protected void onLoad() {
        config = new ResultsPluginConfig(this);
        getLogger().info("Loaded results plugin successfully");
    }

    @Override
    protected void onEnable() {
        getLogger().info("Results plugin is now enabled");
    }

    @Override
    protected void onDisable() {
        getLogger().info("Disabled results plugin");
    }

    @Override
    public ResultsPluginConfig getConfig() {
        return config;
    }
}