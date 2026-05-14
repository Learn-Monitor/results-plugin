plugins {
    java
}

repositories {
    mavenCentral()
    maven {
        name = "GitHubPackages"
        url = uri("https://maven.pkg.github.com/Learn-Monitor/student-database/")
        credentials {
            username = System.getenv("GITHUB_ACTOR")
            password = System.getenv("GITHUB_TOKEN")
        }
    }
}

dependencies {
    compileOnly("igs-landstuhl:student-database:v2.0.0-SNAPSHOT-1") // TODO: Use an api only implementation here
    
    // test framework (optional)
    testImplementation("org.junit.jupiter:junit-jupiter:5.13.4")
}

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(17))
    }
}

tasks.withType<Jar> {
    manifest {
        attributes["Implementation-Title"] = "Example Plugin"
        attributes["Implementation-Version"] = project.version
    }
}

// test configuration
tasks.test {
    useJUnitPlatform()
}

version = "v1.0.0"
group = "igs-landstuhl.plugins"