package com.campus.placement.config;

import com.campus.placement.model.*;
import com.campus.placement.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private StudentRepository studentRepository;
    @Autowired private RecruiterRepository recruiterRepository;
    @Autowired private CompanyRepository companyRepository;
    @Autowired private JobRepository jobRepository;
    @Autowired private ApplicationRepository applicationRepository;
    @Autowired private InterviewRepository interviewRepository;
    @Autowired private SkillRepository skillRepository;
    @Autowired private StudentSkillRepository studentSkillRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return; // Data already initialized
        }

        // 1. Create Skills
        Map<String, Skill> skillsMap = new HashMap<>();
        String[][] skillData = {
            {"Java", "Programming"},
            {"Spring Boot", "Framework"},
            {"React.js", "Frontend"},
            {"Python", "Programming"},
            {"SQL", "Database"},
            {"Machine Learning", "AI"},
            {"AWS", "Cloud"},
            {"Docker", "DevOps"},
            {"Git", "Tools"},
            {"Data Structures & Algorithms", "Core CS"},
            {"Node.js", "Backend"},
            {"TypeScript", "Programming"}
        };
        for (String[] s : skillData) {
            Skill skill = skillRepository.save(new Skill(s[0], s[1]));
            skillsMap.put(s[0], skill);
        }

        // 2. Create Companies
        Company google = companyRepository.save(new Company(
            "Google",
            "Information Technology",
            "https://careers.google.com",
            "Bengaluru, Karnataka",
            "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg",
            "Google's mission is to organize the world's information and make it universally accessible and useful."
        ));

        Company microsoft = companyRepository.save(new Company(
            "Microsoft",
            "Cloud & Enterprise Software",
            "https://careers.microsoft.com",
            "Hyderabad, Telangana",
            "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
            "Empowering every person and every organization on the planet to achieve more."
        ));

        Company amazon = companyRepository.save(new Company(
            "Amazon",
            "E-commerce & Cloud Computing",
            "https://amazon.jobs",
            "Chennai, Tamil Nadu",
            "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
            "Earth's most customer-centric company, where people can find and discover anything they want."
        ));

        Company zoho = companyRepository.save(new Company(
            "Zoho Corporation",
            "SaaS & Business Software",
            "https://www.zoho.com/careers",
            "Chennai, Tamil Nadu",
            "https://www.vectorlogo.zone/logos/zoho/zoho-ar21.svg",
            "A unique and powerful suite of software to run your entire business, built with pride in India."
        ));

        Company tcs = companyRepository.save(new Company(
            "Tata Consultancy Services",
            "IT Services & Consulting",
            "https://www.tcs.com/careers",
            "Mumbai, Maharashtra",
            "https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg",
            "An IT services, consulting and business solutions organization that has been partnering with many of the world's largest businesses."
        ));

        // 3. Create Admin User
        userRepository.save(new User(
            "admin",
            passwordEncoder.encode("admin123"),
            "placement.officer@campus.edu",
            Role.ROLE_ADMIN
        ));

        // 4. Create Recruiters
        User recGoogleUser = userRepository.save(new User(
            "recruiter_google",
            passwordEncoder.encode("google123"),
            "sarah.jenkins@google.com",
            Role.ROLE_RECRUITER
        ));
        Recruiter recGoogle = recruiterRepository.save(new Recruiter(
            recGoogleUser, "Sarah Jenkins", "University Recruiting Lead", "+91 98765 43210", google
        ));

        User recMsftUser = userRepository.save(new User(
            "recruiter_msft",
            passwordEncoder.encode("msft123"),
            "david.chen@microsoft.com",
            Role.ROLE_RECRUITER
        ));
        Recruiter recMsft = recruiterRepository.save(new Recruiter(
            recMsftUser, "David Chen", "Senior Technical Talent Partner", "+91 98765 43211", microsoft
        ));

        User recZohoUser = userRepository.save(new User(
            "recruiter_zoho",
            passwordEncoder.encode("zoho123"),
            "priya.raman@zohocorp.com",
            Role.ROLE_RECRUITER
        ));
        Recruiter recZoho = recruiterRepository.save(new Recruiter(
            recZohoUser, "Priya Raman", "Campus Talent Acquisition", "+91 98765 43212", zoho
        ));

        // 5. Create Students
        User stuArunUser = userRepository.save(new User(
            "student_arun",
            passwordEncoder.encode("student123"),
            "arun.k@student.campus.edu",
            Role.ROLE_STUDENT
        ));
        Student stuArun = new Student(stuArunUser, "Arun Kumar", "CS2021001", "CSE", 8.85, 2025);
        stuArun.setPhone("+91 91234 56789");
        stuArun.setBio("Passionate Full Stack Developer with strong foundations in Java, Spring Boot, and React. Active open source contributor.");
        stuArun.setResumeUrl("https://example.com/resumes/arun_kumar_resume.pdf");
        stuArun.setGithubUrl("https://github.com/arunkumar-dev");
        stuArun.setLinkedinUrl("https://linkedin.com/in/arun-kumar-dev");
        stuArun.setProjects("1. E-Commerce Microservices platform using Spring Boot and Kafka\n2. Real-time Collaborative Code Editor with WebSockets\n3. Campus Placement Portal");
        stuArun = studentRepository.save(stuArun);

        // Add skills for Arun
        studentSkillRepository.save(new StudentSkill(stuArun, skillsMap.get("Java"), "Advanced"));
        studentSkillRepository.save(new StudentSkill(stuArun, skillsMap.get("Spring Boot"), "Advanced"));
        studentSkillRepository.save(new StudentSkill(stuArun, skillsMap.get("React.js"), "Intermediate"));
        studentSkillRepository.save(new StudentSkill(stuArun, skillsMap.get("SQL"), "Advanced"));
        studentSkillRepository.save(new StudentSkill(stuArun, skillsMap.get("Data Structures & Algorithms"), "Advanced"));

        User stuAnanyaUser = userRepository.save(new User(
            "student_ananya",
            passwordEncoder.encode("student123"),
            "ananya.s@student.campus.edu",
            Role.ROLE_STUDENT
        ));
        Student stuAnanya = new Student(stuAnanyaUser, "Ananya Sharma", "IT2021045", "IT", 9.20, 2025);
        stuAnanya.setPhone("+91 92345 67890");
        stuAnanya.setBio("AI and Cloud enthusiast. Top 1% in department. Dean's Honour List 2023 & 2024.");
        stuAnanya.setResumeUrl("https://example.com/resumes/ananya_sharma_resume.pdf");
        stuAnanya.setGithubUrl("https://github.com/ananya-sharma");
        stuAnanya.setLinkedinUrl("https://linkedin.com/in/ananya-sharma-ai");
        stuAnanya.setProjects("1. Predictive Disease Detection using Transformer models\n2. Serverless Cloud Pipeline on AWS Lambda\n3. Financial Risk Analyzer");
        stuAnanya = studentRepository.save(stuAnanya);

        studentSkillRepository.save(new StudentSkill(stuAnanya, skillsMap.get("Python"), "Advanced"));
        studentSkillRepository.save(new StudentSkill(stuAnanya, skillsMap.get("Machine Learning"), "Advanced"));
        studentSkillRepository.save(new StudentSkill(stuAnanya, skillsMap.get("AWS"), "Intermediate"));
        studentSkillRepository.save(new StudentSkill(stuAnanya, skillsMap.get("SQL"), "Intermediate"));

        User stuVikramUser = userRepository.save(new User(
            "student_vikram",
            passwordEncoder.encode("student123"),
            "vikram.p@student.campus.edu",
            Role.ROLE_STUDENT
        ));
        Student stuVikram = new Student(stuVikramUser, "Vikram Patel", "EC2021012", "ECE", 7.60, 2025);
        stuVikram.setPhone("+91 93456 78901");
        stuVikram.setBio("Embedded Systems and IoT developer transitioning to backend systems. Quick learner and team player.");
        stuVikram.setResumeUrl("https://example.com/resumes/vikram_patel_resume.pdf");
        stuVikram.setProjects("1. Smart Agriculture Monitoring with ESP32 and MQTT\n2. Real-time Inventory Tracker Web App");
        stuVikram = studentRepository.save(stuVikram);

        studentSkillRepository.save(new StudentSkill(stuVikram, skillsMap.get("Java"), "Intermediate"));
        studentSkillRepository.save(new StudentSkill(stuVikram, skillsMap.get("Data Structures & Algorithms"), "Intermediate"));
        studentSkillRepository.save(new StudentSkill(stuVikram, skillsMap.get("Git"), "Advanced"));

        // 6. Create Jobs
        Job jobGoogle = new Job(
            google, recGoogle,
            "Software Development Engineer (Campus New Grad)",
            "We are looking for passionate graduate engineers to design and implement large-scale distributed systems that power Search, Cloud, and Android. You will collaborate with cross-functional teams to build resilient architectures.",
            "Full-Time",
            "Bengaluru, Karnataka",
            "24.5 LPA",
            8.0,
            "CSE,IT",
            LocalDate.now().plusMonths(1)
        );
        jobGoogle.setRequiredSkills(new HashSet<>(Arrays.asList(
            skillsMap.get("Java"),
            skillsMap.get("Data Structures & Algorithms"),
            skillsMap.get("Spring Boot")
        )));
        jobGoogle = jobRepository.save(jobGoogle);

        Job jobMsft = new Job(
            microsoft, recMsft,
            "Cloud Solutions Software Engineer",
            "Join the Azure engineering team to build scalable enterprise cloud services. You will write clean, well-tested code and work on distributed systems, container orchestration, and multi-tenant architectures.",
            "Full-Time",
            "Hyderabad, Telangana",
            "21.0 LPA",
            7.5,
            "CSE,IT,ECE",
            LocalDate.now().plusMonths(2)
        );
        jobMsft.setRequiredSkills(new HashSet<>(Arrays.asList(
            skillsMap.get("Java"),
            skillsMap.get("AWS"),
            skillsMap.get("Docker")
        )));
        jobMsft = jobRepository.save(jobMsft);

        Job jobZoho = new Job(
            zoho, recZoho,
            "Product Developer - Backend & Full Stack",
            "Zoho is hiring talented problem solvers who love writing robust code from scratch. You will work on real customer problems, building scalable web applications for millions of business users worldwide.",
            "Full-Time",
            "Chennai, Tamil Nadu",
            "11.5 LPA",
            6.5,
            "CSE,IT,ECE,EEE,MECH,CIVIL",
            LocalDate.now().plusWeeks(3)
        );
        jobZoho.setRequiredSkills(new HashSet<>(Arrays.asList(
            skillsMap.get("Java"),
            skillsMap.get("SQL"),
            skillsMap.get("React.js")
        )));
        jobZoho = jobRepository.save(jobZoho);

        Job jobAmazonIntern = new Job(
            amazon, recGoogle,
            "Software Development Intern (6 Months)",
            "6-month immersive internship with direct mentorship from senior engineers. High probability of PPO (Pre-Placement Offer) conversion based on performance.",
            "Internship",
            "Chennai, Tamil Nadu",
            "80,000 / month",
            7.0,
            "CSE,IT,ECE",
            LocalDate.now().plusWeeks(2)
        );
        jobAmazonIntern.setRequiredSkills(new HashSet<>(Arrays.asList(
            skillsMap.get("Java"),
            skillsMap.get("Data Structures & Algorithms")
        )));
        jobAmazonIntern = jobRepository.save(jobAmazonIntern);

        // 7. Seed Applications (Representing different workflow stages)
        // Arun applied to Google -> Interview Scheduled
        Application app1 = new Application(jobGoogle, stuArun,
            "I have deep expertise in Java and distributed systems, with 400+ LeetCode problems solved.",
            stuArun.getResumeUrl());
        app1.setStatus(ApplicationStatus.INTERVIEW_SCHEDULED);
        app1.setRecruiterNotes("Strong coding fundamentals and great projects. Recommended for Round 1 Technical.");
        app1 = applicationRepository.save(app1);

        Interview int1 = new Interview(
            app1,
            "Technical Round 1 - Problem Solving & DSA",
            LocalDateTime.now().plusDays(2).withHour(14).withMinute(0).withSecond(0),
            "ONLINE",
            "https://meet.google.com/abc-placement-demo",
            "Google Meet"
        );
        int1.setStatus(InterviewStatus.SCHEDULED);
        interviewRepository.save(int1);

        // Arun applied to Microsoft -> Shortlisted
        Application app2 = new Application(jobMsft, stuArun,
            "Excited about Azure cloud architecture and enterprise systems.",
            stuArun.getResumeUrl());
        app2.setStatus(ApplicationStatus.SHORTLISTED);
        app2.setRecruiterNotes("Resume shortlisted for upcoming coding assessment.");
        applicationRepository.save(app2);

        // Arun applied to Zoho -> SELECTED (Offer Letter stage!)
        Application app3 = new Application(jobZoho, stuArun,
            "Passionate about SaaS engineering and building products end-to-end.",
            stuArun.getResumeUrl());
        app3.setStatus(ApplicationStatus.SELECTED);
        app3.setRecruiterNotes("Cleared both Technical and HR rounds with outstanding rating. Offer extended!");
        app3 = applicationRepository.save(app3);

        Interview intZoho = new Interview(
            app3,
            "HR & Director Discussion",
            LocalDateTime.now().minusDays(3).withHour(11).withMinute(0),
            "ONLINE",
            "https://meet.zoho.com/hr-arun",
            "Zoho Meeting"
        );
        intZoho.setStatus(InterviewStatus.PASSED);
        intZoho.setFeedback("Excellent communication skills and strong culture fit. Extended 11.5 LPA package.");
        intZoho.setScore(9);
        interviewRepository.save(intZoho);

        // Ananya applied to Google -> Shortlisted
        Application app4 = new Application(jobGoogle, stuAnanya,
            "Passionate about algorithmic problem solving and machine learning at scale.",
            stuAnanya.getResumeUrl());
        app4.setStatus(ApplicationStatus.SHORTLISTED);
        app4.setRecruiterNotes("Exceptional 9.20 CGPA and AI publications.");
        applicationRepository.save(app4);

        // Vikram applied to Zoho -> APPLIED (under review)
        Application app5 = new Application(jobZoho, stuVikram,
            "Applying for Zoho developer position. Interested in systems programming.",
            stuVikram.getResumeUrl());
        app5.setStatus(ApplicationStatus.APPLIED);
        applicationRepository.save(app5);

        System.out.println(">>> Smart Campus Placement System Seed Data Initialized Successfully! <<<");
    }
}
