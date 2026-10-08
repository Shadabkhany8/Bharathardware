package com.bharatsponge.config;

import com.bharatsponge.entity.*;
import com.bharatsponge.repository.CategoryRepository;
import com.bharatsponge.repository.CustomerRepository;
import com.bharatsponge.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final CustomerRepository customerRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(CustomerRepository customerRepository,
                           CategoryRepository categoryRepository,
                           ProductRepository productRepository,
                           PasswordEncoder passwordEncoder) {
        this.customerRepository = customerRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUsers();
        seedCatalog();
    }

    private void seedUsers() {
        customerRepository.findByEmail("customer@bharatsponge.com").ifPresentOrElse(
                customer -> {
                    customer.setAddress("Shop No. 42, Loha Mandi, Malwa Mills Road");
                    customer.setCity("Indore");
                    customer.setState("Madhya Pradesh");
                    customer.setPincode("452001");
                    customer.setPasswordHash(passwordEncoder.encode("Password@123"));
                    customerRepository.save(customer);
                },
                () -> {
                    Customer customer = new Customer(
                            "CUST-BS-1001",
                            "Rajesh Sharma",
                            "Sharma Hardware & Tools Mart",
                            "9876543210",
                            "customer@bharatsponge.com",
                            passwordEncoder.encode("Password@123"),
                            "Shop No. 42, Loha Mandi, Malwa Mills Road",
                            "Indore",
                            "Madhya Pradesh",
                            "452001",
                            Role.ROLE_CUSTOMER
                    );
                    customerRepository.save(customer);
                    log.info("Demo wholesale customer created: customer@bharatsponge.com / Password@123");
                }
        );

        customerRepository.findByEmail("admin@bharatsponge.com").ifPresentOrElse(
                admin -> {
                    admin.setName("Shadab Khan");
                    admin.setBusinessName("Bharat Sponge Enterprises (Indore)");
                    admin.setPhone("8305288431");
                    admin.setAddress("Sanwer Road Industrial Area");
                    admin.setCity("Indore");
                    admin.setState("Madhya Pradesh");
                    admin.setPincode("452015");
                    admin.setPasswordHash(passwordEncoder.encode("Admin@123"));
                    customerRepository.save(admin);
                },
                () -> {
                    Customer admin = new Customer(
                            "ADMIN-BS-0001",
                            "Shadab Khan",
                            "Bharat Sponge Enterprises (Indore)",
                            "8305288431",
                            "admin@bharatsponge.com",
                            passwordEncoder.encode("Admin@123"),
                            "Sanwer Road Industrial Area",
                            "Indore",
                            "Madhya Pradesh",
                            "452015",
                            Role.ROLE_ADMIN
                    );
                    customerRepository.save(admin);
                    log.info("Demo admin user created: admin@bharatsponge.com / Admin@123");
                }
        );
    }


    private void seedCatalog() {
        if (categoryRepository.count() == 0) {
            Category cat1 = categoryRepository.save(new Category("Abrasive Sponges & Blocks", "Industrial grade flexible sanding and abrasive sponge blocks for wood, metal, and drywall.", "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=500&auto=format&fit=crop"));
            Category cat2 = categoryRepository.save(new Category("Polishing & Buffing Pads", "High density foam buffing pads and compounding sponges for automotive and metal finishing.", "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500&auto=format&fit=crop"));
            Category cat3 = categoryRepository.save(new Category("Industrial Scouring Pads", "Heavy-duty nylon mesh scouring pads for industrial machinery cleaning, rust prep, and degreasing.", "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop"));
            Category cat4 = categoryRepository.save(new Category("Metal & Rust Prep Sponges", "Silicon carbide abrasive sponges designed for weld blending, rust removal, and contour sanding.", "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=500&auto=format&fit=crop"));
            Category cat5 = categoryRepository.save(new Category("Hardware & Finishing Accessories", "Specialty sponge holders, interface backing pads, and bulk wholesale rolls.", "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop"));

            productRepository.saveAll(List.of(
                    new Product(cat1, "BS-SP-101", "Bharat SuperGrit Sanding Sponge (Medium 120)", "Four-sided abrasive foam sponge for profiled woodwork and metal surfaces. Washable and reusable.", "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=500&auto=format&fit=crop", "Box of 24", new BigDecimal("480.00"), 5, 250),
                    new Product(cat1, "BS-SP-102", "Bharat UltraFine Flexible Foam Pad (Grit 320)", "High-flexibility thin foam abrasive pad ideal for curved auto body panels and primer scuffing.", "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=500&auto=format&fit=crop", "Box of 50", new BigDecimal("850.00"), 3, 180),
                    new Product(cat1, "BS-SP-103", "Bharat Dual-Density Sanding Block (Coarse 60)", "Rigid dense core with coarse aluminum oxide coating for rapid material removal on hardwoods and iron.", "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=500&auto=format&fit=crop", "Pack of 12", new BigDecimal("360.00"), 10, 400),
                    new Product(cat2, "BS-POL-201", "ProBuff Waffle Foam Polishing Pad (6-Inch)", "Precision cut waffle face prevents swirl marks and distributes cutting compound evenly across panels.", "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500&auto=format&fit=crop", "Pack of 5", new BigDecimal("650.00"), 4, 120),
                    new Product(cat2, "BS-POL-202", "Microfiber Finishing Sponge Applicator", "Dense polyurethane sponge wrapped in scratch-free microfiber for ceramic coatings and sealant wax.", "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500&auto=format&fit=crop", "Pack of 10", new BigDecimal("420.00"), 8, 300),
                    new Product(cat3, "BS-IND-301", "Heavy Duty Industrial Green Scourer (Extra Coarse)", "Industrial web scouring pad for commercial equipment, foundry cleaning, and heavy rust preparation.", "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop", "Carton of 60", new BigDecimal("1200.00"), 2, 85),
                    new Product(cat3, "BS-IND-302", "Non-Scratch Blue Industrial Degreasing Sponge", "Tough cellulose core combined with non-woven scrubbing surface for factory maintenance and tooling.", "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop", "Carton of 48", new BigDecimal("960.00"), 3, 140),
                    new Product(cat4, "BS-RST-401", "Diamond Hand Polishing Sponge (Grit 200)", "Electroplated diamond abrasive surface on ergonomic EVA foam base. Cuts through granite, glass, and hardened steel.", "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=500&auto=format&fit=crop", "Piece", new BigDecimal("290.00"), 10, 320),
                    new Product(cat4, "BS-RST-402", "Silicon Carbide Contoured Rust Stripper Block", "Beveled edge sanding sponge engineered to access grooves, welded seams, and pipe perimeters.", "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=500&auto=format&fit=crop", "Box of 20", new BigDecimal("580.00"), 5, 210),
                    new Product(cat5, "BS-ACC-501", "Hook & Loop Sponge Interface Cushion Pad (5-Inch)", "Soft density foam interface pad to minimize burn-through on orbital disc sanders.", "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop", "Pack of 4", new BigDecimal("380.00"), 5, 160),
                    new Product(cat5, "BS-ACC-502", "Continuous Abrasive Foam Roll (115mm x 25M, Grit 180)", "Perforated sponge roll in dispensing box. Tear off exact length needed for workshops and fabrication lines.", "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop", "Roll", new BigDecimal("1450.00"), 2, 75)
            ));
            log.info("Sample wholesale hardware catalog successfully initialized");
        }
    }
}
