export interface ContributorProfile {
    name: string;
    role: string;
    login?: string;
    email?: string;
    linkedin?: string;
    github?: string;
    avatar?: string;
}

export const FEATURED_CONTRIBUTORS: ContributorProfile[] = [
    {
        name: "Jeel Dobariya",
        role: "Owner",
        login: "JeelDobariya38",
        email: "jeeldobariya38@gmail.com",
        linkedin: "https://www.linkedin.com/in/jeeldobariya/",
        github: "https://github.com/JeelDobariya38",
        avatar: "https://github.com/JeelDobariya38.png",
    },
    {
        name: "Harsha Vardhan Burra",
        role: "Open Source Maintainer",
        login: "harsha-vardhan-burra",
        email: "harshavardhanburra.dev@gmail.com",
        linkedin: "https://www.linkedin.com/in/harsha-vardhan-burra",
        github: "https://github.com/harsha-vardhan-burra",
        avatar: "https://github.com/harsha-vardhan-burra.png",
    },
    {
        name: "Josip",
        role: "CI/CD & Security Expert",
        login: "razorblade23",
        github: "https://github.com/razorblade23",
        avatar: "https://github.com/razorblade23.png",
    },
    {
        name: "Achmad Daniel Syahputra",
        role: "Code Reviewer",
        login: "kudanilll",
        linkedin: "https://www.linkedin.com/in/achmaddaniel/",
        github: "https://github.com/kudanilll",
        avatar: "https://github.com/kudanilll.png",
    },
    {
        name: "A Guy",
        role: "Community Manager",
        login: "I-A-GUY",
        github: "https://github.com/I-A-GUY",
        avatar: "https://github.com/I-A-GUY.png",
    },
    {
        name: "hexCode",
        role: "Contributor",
        login: "hexCode63",
        github: "https://github.com/hexCode63",
        avatar: "https://github.com/hexCode63.png",
    },
];
